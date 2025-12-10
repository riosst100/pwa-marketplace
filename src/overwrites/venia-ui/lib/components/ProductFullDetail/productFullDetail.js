import React, { useState, useMemo, Fragment, Suspense, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';
import { useToasts } from '@magento/peregrine/lib';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import QuantityStepper from '../QuantityStepper';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import CustomAttributes from './CustomAttributes';
import ProductCardDetails from './ProductCardDetails';
import defaultClasses from './productFullDetail.module.css';
import cn from 'classnames';
import Tabs from '@riosst100/pwa-marketplace/src/components/commons/Tabs';
import ProductReviews from './components/productReview';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { Star1, Verify, Sms, Message, Shop, ArrowUp2 } from 'iconsax-react';
import { Link } from "react-router-dom";
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { GET_PAYMENT_TYPES } from '@riosst100/pwa-marketplace/src/talons/ProductContent/productContent.gql.js';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));
const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));
import Share from '@riosst100/pwa-marketplace/src/components/SocialMediaShare';
import PreorderDetail from './components/preOrderDetail';
import AuctionDetail from './components/auctionDetail';
import CrossSeller from '@riosst100/pwa-marketplace/src/components/CrossSeller';
import ProductLabel from '@riosst100/pwa-marketplace/src/components/ProductLabel';
import RFQ from '@riosst100/pwa-marketplace/src/components/RFQ';
import LinkToOtherStores from '@riosst100/pwa-marketplace/src/components/LinkToOtherStores';
import Collapsible from '@riosst100/pwa-marketplace/src/components/commons/Collapsible';
import { useLocation } from 'react-router-dom';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { ShoppingCart } from 'react-feather';
import MessagesModal from '@riosst100/pwa-marketplace/src/components/LiveChat/MessagesModal';
import SellerOperations from '@riosst100/pwa-marketplace/src/talons/Seller/seller.gql';

import { totalListings, lowestPrice } from '@riosst100/pwa-marketplace/src/components/CrossSeller/crossSellerBuy';

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductDetailsCollapsible = (props) => {
    const { data } = props;

    return (
        <>
            {data.map((_data) => (
                <Collapsible
                    title={_data.title}
                    contentWrapperClassName="!mt-0"
                    rootClassName="first-of-type_!border-0 last-of-type_border-b last-of-type_border-gray-100"
                    className="last-of-type_border-b last-of-type_border-gray-100"
                >
                    {_data.content}
                </Collapsible>
            ))}
        </>
    )
}

const ProductFullDetail = props => {
    const { product } = props;

    const { search } = useLocation();

    const params = new URLSearchParams(search);
    const isPreview = params.get('preview');

    const talonProps = useProductFullDetail({ product, isPreview });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart: originalHandleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isEverythingOutOfStock,
        outOfStockVariants,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        selectedMedia,
        productDetails,
        customAttributes,
        productDetailsAttributes,
        wishlistButtonProps,
        sellerDetails,
        handleToastAction,
        addToCartResponseData,
        errorAddingProductToCart,
        isAddProductLoading,
    } = talonProps;

    const [, { addToast }] = useToasts();
    const [{ isSignedIn }] = useUserContext();

    const { formatMessage } = useIntl();

    const { data: paymentTypeData } = useQuery(GET_PAYMENT_TYPES, {
        fetchPolicy: 'cache-and-network'
    });

    const paymentTypeOptions = paymentTypeData?.getPaymentType || [];

    const classes = useStyle(defaultClasses, props.classes);

    const [hoveredMedia, setHoveredMedia] = useState(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState(null);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);

    // Messages GraphQL operations
    const {
        getCustomerSellerMessages,
        customerSendMessageMutation,
        customerReplyMessageMutation,
        customerDeleteMessageMutation
    } = SellerOperations;

    const [messageListVars] = useState({
        pageSize: 500,
        currentPage: 1,
        filter: undefined,
        sort: undefined
    });

    const {
        data: messagesData,
        loading: messagesLoading,
        error: messagesError,
        refetch: refetchMessages
    } = useQuery(getCustomerSellerMessages, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only',
        variables: messageListVars,
        pollInterval: 10000,
        notifyOnNetworkStatusChange: true
    });

    const [sendMessage] = useMutation(customerSendMessageMutation);
    const [replyMessage] = useMutation(customerReplyMessageMutation);
    const [deleteMessage] = useMutation(customerDeleteMessageMutation);

    const handleSendMessage = async ({ subject, content, seller_url }) => {
        const input = { subject, content, seller_url };
        const result = await sendMessage({ variables: { input }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({ id: 'messages.messageSent', defaultMessage: 'Message sent successfully.' }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
        return result?.data?.customerSendMessage;
    };

    const handleReplyMessage = async ({ message_id, content }) => {
        const input = { message_id, content };
        const result = await replyMessage({ variables: { input }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({ id: 'messages.replySent', defaultMessage: 'Reply sent successfully.' }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
        return result?.data?.customerReplyMessage;
    };

    const handleDeleteMessage = async ({ id }) => {
        await deleteMessage({ variables: { id }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({ id: 'messages.messageDeleted', defaultMessage: 'Message deleted successfully.' }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
    };

    const openMessagesModal = () => {
        if (!isSignedIn) {
            addToast({
                type: 'info',
                message: formatMessage({
                    id: 'messages.loginRequired',
                    defaultMessage: 'Please sign in to your account to send a message to the seller.'
                }),
                timeout: 3000
            });
            return;
        }
        setIsMessagesOpen(true);
    };
    const closeMessagesModal = () => setIsMessagesOpen(false);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
                setHoveredMedia={setHoveredMedia}
                variants={product.variants}
                isEverythingOutOfStock={isEverythingOutOfStock}
                outOfStockVariants={outOfStockVariants}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
            currentProductCustomTableMetadata={productDetails.custom_table_metadata}
        />
    ) : null;
    
    // Fill a map with field/section -> error.
    const errors = new Map();

    useEffect(() => {
        if (errorMessage) {
            Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
                if (errorMessage.includes(key)) {
                    const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                    const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                    errors.set(target, message);
                }
            });

            addToast({
                type: 'error',
                message: 'Desired quantity not available. You already have all of these in your cart.',
                timeout: 3000
            });

            // Handle cases where a user token is invalid or expired. Preferably
            // this would be handled elsewhere with an error code and not a string.
            // if (errorMessage.includes('The current user cannot')) {
            //     errors.set('form', [
            //         new Error(
            //             formatMessage({
            //                 id: 'productFullDetail.errorToken',
            //                 defaultMessage:
            //                     'There was a problem with your cart. Please sign in again and try adding the item once more.'
            //             })
            //         )
            //     ]);
            // }

            // Handle cases where a cart wasn't created properly.
            // if (
            //     errorMessage.includes('Variable "$cartId" got invalid value null')
            // ) {
            //     errors.set('form', [
            //         new Error(
            //             formatMessage({
            //                 id: 'productFullDetail.errorCart',
            //                 defaultMessage:
            //                     'There was a problem with your cart. Please refresh the page and try adding the item once more.'
            //             })
            //         )
            //     ]);
            // }

            // An unknown error should still present a readable message.
            // if (!errors.size) {
            //     errors.set('form', [
            //         new Error(
            //             formatMessage({
            //                 id: 'productFullDetail.errorUnknown',
            //                 defaultMessage:
            //                     'Could not add item to cart. Please check required options and try again.'
            //             })
            //         )
            //     ]);
            // }
        }
    }, [errorMessage]);

    const customAttributesDetails = useMemo(() => {
        const list = [];
        const pagebuilder = [];
        if (Array.isArray(customAttributes)) {
            customAttributes.forEach(customAttribute => {
                if (
                    customAttribute.attribute_metadata.ui_input
                        .ui_input_type === 'PAGEBUILDER'
                ) {
                    pagebuilder.push(customAttribute);
                } else {
                    list.push(customAttribute);
                }
            });
        }
        // list.unshift(skuAttribute);
        return {
            list: list,
            pagebuilder: pagebuilder
        };
    }, [customAttributes, productDetails.sku, formatMessage]);

    const productCardDetailsAttributes = useMemo(() => {
        const list = [];
        const pagebuilder = [];
        if (Array.isArray(productDetailsAttributes)) {
            productDetailsAttributes.forEach(customAttribute => {
                if (
                    customAttribute.attribute_metadata.ui_input
                        .ui_input_type === 'PAGEBUILDER'
                ) {
                    pagebuilder.push(customAttribute);
                } else {
                    list.push(customAttribute);
                }
            });
        }
        // list.unshift(skuAttribute);
        return {
            list: list,
            pagebuilder: pagebuilder
        };
    }, [productDetailsAttributes, productDetails.sku, formatMessage]);

    const shortDescription = productDetails.shortDescription ? (
        <RichText
            rootClassName="px-0"
            content={productDetails.shortDescription.html}
        />
    ) : null;

    const pageBuilderAttributes = customAttributesDetails.pagebuilder.length ? (
        <section className={classes.detailsPageBuilder}>
            <CustomAttributes
                classes={{ list: classes.detailsPageBuilderList }}
                customAttributes={customAttributesDetails.pagebuilder}
                showLabels={false}
            />
        </section>
    ) : null;

    const review_count = 0;
    const rating_value = 0;

    const tokopedia_logo = './tokopedia_logo.png';

    const contentContainerClass = 'content-container max-w-[1040px] p-2.5 m-auto relative mt-0 lg_mt-[34px] pb-6 lg_pb-0'
    const ProductDescription = () => (
        <div className={cn(contentContainerClass, classes.contentContainerTabOverride)}>
            <RichText
                rootClassName="px-0"
                content={productDetails.description}
            />
        </div>
    );

    const ProductMoreInfo = () => (
        <>
            <div className={cn(contentContainerClass, classes.contentContainerTabOverride)}>
                <CustomAttributes
                    customAttributes={customAttributesDetails.list}
                    classes={{ list: classes.customAttributesList }}
                />
            </div>
            {pageBuilderAttributes}
        </>
    );

    const customAttributesList = useMemo(
        () =>
            customAttributesDetails.list.reduce((customAttributesData, currentAttribute) => {
                const attrCode = currentAttribute.attribute_metadata?.code || null;
                const value = currentAttribute.entered_attribute_value?.value || "";
                if (attrCode) {
                    customAttributesData.push({
                        'code': attrCode,
                        'value': value
                    });
                }

                return customAttributesData;
            }, []),
        [customAttributesDetails.list]
    );

    const ProductTNC = () => (
        <div className={cn(contentContainerClass, classes.contentContainerTabOverride)}>
            <p>{customAttributesList.map((data, index) => {
                if (data.code == "term_and_conditions") {
                    return data.value;
                }
            })}</p>
        </div>
    )

    const ShippingPolicy = () => (
        <div className={cn(contentContainerClass, classes.contentContainerTabOverride)}>
            <p>{customAttributesList.map((data, index) => {
                if (data.code == "shipping_policy") {
                    return data.value;
                }
            })}</p>
        </div>
    )

    const ReturnPolicy = () => (
        <div className={cn(contentContainerClass, classes.contentContainerTabOverride)}>
            <p>{customAttributesList.map((data, index) => {
                if (data.code == "return_policy") {
                    return data.value;
                }
            })}</p>
        </div>
    )

    const ProductFAQ = () => (
        <div className={cn(contentContainerClass, classes.contentContainerTabOverride)}>
            {customAttributesList.map((data, index) => {
                if (data.code == "faq") {
                    return (
                        <RichText
                            rootClassName="px-0"
                            content={data.value}
                        />
                    );
                }
            })}

        </div>
    )

    
    const getAttributeValue = (customAttributesDetails, key, useSuffix = false) => {
        if (!customAttributesDetails?.list?.length) return "";

        const attr = customAttributesDetails.list.find(attr => {
            const code = attr.attribute_metadata?.code || "";
            return useSuffix ? code.endsWith(key) : code === key;
        });
        if (!attr) return "";

        if (attr.selected_attribute_options?.attribute_option?.length) {
            return attr.selected_attribute_options.attribute_option
                .map(opt => opt.label)
                .join(", ");
        }
        return attr.entered_attribute_value?.value || "";
    };

    const preOrder = getAttributeValue(productCardDetailsAttributes, "card_pre_orders", true);
    const preOrderDate = getAttributeValue(productCardDetailsAttributes, "pre_order_date", true);
    const preOrderDeposite = getAttributeValue(productCardDetailsAttributes, "pre_order_deposit", true);
    const preOrderNote = getAttributeValue(productCardDetailsAttributes, "pre_order_notes", true);
    const preOrderPaymentType = getAttributeValue(productCardDetailsAttributes, "pre_order_payment_type", true);
    const releaseDate = getAttributeValue(productCardDetailsAttributes, "release_date", true);
    const setNameValue = getAttributeValue(productCardDetailsAttributes, "card_set", true);
    const cardNameValue = getAttributeValue(productCardDetailsAttributes, "card_name", true);
    const cardNumberValue = getAttributeValue(productCardDetailsAttributes, "card_number", true);
    const rarityValue = getAttributeValue(productCardDetailsAttributes, "card_rarity", true);
    const featureValue = getAttributeValue(productCardDetailsAttributes, "card_feature", true);
    const conditionValue = getAttributeValue(productCardDetailsAttributes, "card_condition", true);
    const foilValue = getAttributeValue(productCardDetailsAttributes, "card_foil", true);

    const isPreOrderProduct = typeof preOrder === 'string'
        ? preOrder.trim().toLowerCase() === 'pre orders'
        : !!(preOrder && preOrder.is_preorder);

    const parsePreOrderClosingDate = (value) => {
        if (!value) return null;

        const parsed = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(parsed.getTime())) return null;

        // Normalise to end of day for fairness
        parsed.setHours(23, 59, 59, 999);
        return parsed;
    };

    const preOrderClosingDateObj = parsePreOrderClosingDate(preOrderDate);
    const isPreOrderClosed =
        isPreOrderProduct &&
        preOrderClosingDateObj !== null &&
        new Date().getTime() > preOrderClosingDateObj.getTime();

    const cartCallToActionText =
        isPreOrderClosed
            ? (
                <FormattedMessage
                    id="productFullDetail.preOrderClosed"
                    defaultMessage="Pre Order Closed"
                />
            )
            : isPreOrderProduct
                ? (
                    <FormattedMessage
                        id="productFullDetail.preOrderNow"
                        defaultMessage="Pre Order Now"
                    />
                )
                : !isEverythingOutOfStock || !isOutOfStock
                    ? (
                        <FormattedMessage
                            id="productFullDetail.addItemToCart"
                            defaultMessage="Add to Cart"
                        />
                    )
                    : (
                        <FormattedMessage
                            id="productFullDetail.itemOutOfStock"
                            defaultMessage="Out of Stock"
                        />
                    );

    // Error message for screen reader
    const cartActionContent = isSupportedProductType ? (
        <section className={cn(classes.actButton, 'justify-between flex gap-x-[20px] px-[15px] py-0')}>
           <RFQ
                disabled={isAddToCartDisabled || isPreOrderClosed}
                classes={{ rfqButton: cn(classes.rfqButton, "w-full") }}
            />
            <Button
                data-cy="ProductFullDetail-addToCartButton"
                disabled={isAddToCartDisabled || isPreOrderClosed}
                aria-disabled={isAddToCartDisabled || isPreOrderClosed}
                aria-label={
                    isPreOrderClosed
                        ? 'Pre order closing date has passed'
                        : isPreOrderProduct
                            ? ''
                            : isEverythingOutOfStock
                        ? formatMessage({
                            id: 'productFullDetail.outOfStockProduct',
                            defaultMessage:
                                'This item is currently out of stock'
                        })
                        : ''
                }
                classes={{
                    rootClass: '!px-0 !py-3',
                    content: 'w-full normal-case font-medium text-[14px]'
                }}
                priority="high"
                type="submit"
            >
                {cartCallToActionText}
            </Button>
        </section>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={
                        'This product is currently unavailable for purchase.'
                    }
                />
            </p>
        </div>
    );
    const ExpandableSection = ({ children, maxHeight = 480 }) => {
    const [expanded, setExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const contentRef = useRef(null);

        useEffect(() => {
            if (!contentRef.current) return;

            const checkContent = () => {
                const { scrollHeight } = contentRef.current;
                const isDesktop = window.innerWidth >= 769;

                if (isDesktop && scrollHeight > maxHeight) {
                    setShowButton(true);
                } else {
                    setShowButton(false);
                    setExpanded(false);
                }
            };

            checkContent();
            window.addEventListener("resize", checkContent);
            return () => window.removeEventListener("resize", checkContent);
        }, [children, maxHeight]);

        const isDesktop = typeof window !== "undefined" && window.innerWidth >= 769;

        return (
            <>
                <div className="relative">
                    <div
                        ref={contentRef}
                        style={{
                            maxHeight:
                                isDesktop && showButton && !expanded
                                    ? `${maxHeight}px`
                                    : "none",
                            overflow: "hidden",
                            transition: "max-height 0.3s ease"
                        }}
                    >
                        {children}
                    </div>

                    {isDesktop && !expanded && showButton && (
                        <div className={cn("absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t to-transparent pointer-events-none", classes.productDetailsMaxContent)}/>
                    )}
                </div>
                {isDesktop && showButton && (
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="mt-0 text-[14px] text-blue-600 font-medium underline focus:outline-none"
                    >
                        {expanded ? "Show Less" : "Read More"} <ArrowUp2 size="14" style={{
                            "display": "inline-block",
                            "marginLeft": "5px"
                        }} className={cn(expanded ? 'rotate-0 ' : 'rotate-180', 'transition-all stroke-current')} variant="Outline" />
                    </button>
                )}
            </>
        );
    };

    const dataTabs =
    [
        {
            id: 'product-more-info',
            title: 'Product Information',
            content: <ProductMoreInfo />
        },
        {
            id: 'product-detail',
            title: 'Product Description',
            content: <ProductDescription />
        },
        {
            id: 'product-tnc',
            title: 'Term & Conditions',
            content: <ProductTNC />
        },
        {
            id: 'product-shipping-policy',
            title: 'Shipping Policy',
            content: <ShippingPolicy />
        },
        {
            id: 'product-return-policy',
            title: 'Return Policy',
            content: <ReturnPolicy />
        },
        {
            id: 'product-faq',
            title: 'FAQ',
            content: <ProductFAQ />
        },
        {
            id: 'product-reviews',
            title: 'Reviews',
            content: <ProductReviews className={cn(contentContainerClass, classes.contentContainerTabOverride)} />
        }
    ];

    const getSellerAddressDisplay = (seller) => {
        let city = seller?.city;
        let country = seller?.country;

        let result = '';
        if (city && country) {
            result = `${city}, ${country}`;
        }
        if (city && !country) {
            result = `${city}`;
        }
        if (!city && country) {
            result = `${country}`;
        }        
        return result;
    }

    const productPreviewMessages = isPreview && productDetails?.publish_status != 1 ? (
        <div
        style={{
            backgroundColor: "white", // Light gray background
            border: "1px solid rgb(242 101 102)", // Subtle border
            borderRadius: "5px", // Rounded corners
            padding: "10px 15px", // Space inside the box
            margin: "10px 0px 20px 0", // Space outside the box
            fontSize: "14px", // Readable text size
            color: "rgb(242 101 102)", // Dark gray text
        }}
        >
            <span
                style={{
                fontWeight: "500", // Slightly bold text
                }}
            >
                This is a preview of your product. Only you can see this page.
            </span>
        </div>
    ) : null;

    const AlertCircleIcon = <Icon src={ShoppingCart} attrs={{ width: 20 }} />;

    const handleAddToCart = async formValues => {
        try {
            const parseDepositNumber = (value) => {
                if (value === null || value === undefined) return undefined;
                if (typeof value === 'number') return value;
                const numeric = Number.parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
                return Number.isFinite(numeric) ? numeric : undefined;
            };

            let preorderPayload;
            if (selectedPaymentType) {
                preorderPayload = {
                    pre_order_payment_type: selectedPaymentType
                };
                if (selectedPaymentType === 'deposit') {
                    const dep = parseDepositNumber(preOrderDeposite);
                    if (dep !== undefined) {
                        preorderPayload.pre_order_deposit = dep;
                    }
                }
            }

            const nextValues = {
                ...formValues,
                preorder: preorderPayload
            };
            await originalHandleAddToCart(nextValues);
        } catch (e) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'productFullDetail.addToCartError',
                    defaultMessage: 'Failed to add product to cart.'
                })
            });
        }
    };

    useEffect(() => {
        if (
            addToCartResponseData 
            && !addToCartResponseData?.addProductsToCart?.user_errors.length 
            && !isAddProductLoading 
            && !errorAddingProductToCart
        ) {
            addToast({
                type: 'success',
                icon: AlertCircleIcon,
                message: formatMessage({
                    id: 'productFullDetail.addToCartSuccess',
                    defaultMessage: '1 item added to cart.'
                }),
                timeout: 5000,
                dismissable: true,
                hasDismissAction: true,
                dismissActionText: formatMessage({
                    id: 'productFullDetail.addToCartContinueShipping',
                    defaultMessage: 'Continue Shopping'
                }),
                actionText: formatMessage({
                    id: 'productFullDetail.addToCartViewCart',
                    defaultMessage: 'View Shopping Cart'
                }),
                onAction: removeToast =>
                    handleToastAction(
                        removeToast
                    )
            });
        }
    }, [addToCartResponseData, errorAddingProductToCart, isAddProductLoading]);

    useEffect(() => {
        const toastRoot = document.getElementById('toast-root');
        if (toastRoot) {
            toastRoot.classList.add('toast-center-bottom');
        }
        return () => {
            if (toastRoot) {
                toastRoot.classList.remove('toast-center-bottom');
            }
        };
    }, []);

    return (
        <Fragment>
            {breadcrumbs}
            {productPreviewMessages}
            <Form
                className={classes.root}
                data-cy="ProductFullDetail-root"
                onSubmit={handleAddToCart}
            >
                <section className={cn(classes.leftContainer, 'relative')}>
                    <ProductLabel item={productDetails} />
                    <Carousel images={mediaGalleryEntries} hoveredMedia={hoveredMedia} selectedMedia={selectedMedia}/>
                </section>
                <section className={classes.rightContainer}>
                    <div
                        className={cn(
                            classes.title,
                            'mb-xs',
                        )}
                    >
                        <h1
                            aria-live="polite"
                            className={cn(
                                classes.productName,
                                '!font-medium leading-[1] mb-1.5 line-clamp-2 !text-[1.5rem]'
                            )}
                            data-cy="ProductFullDetail-productName"
                        >
                            {productDetails.name}
                        </h1>
                    </div>
                    <section className="bottom_right-container justify-center gap-x-6 block sm_flex md_flex lg_flex xl_flex 2xl_flex gap-[7px]">
                        <section className='right_left-container w-full'>
                            <ExpandableSection>
                                <div className="text-sm leading-6 leading-[2.5rem]">
                                    {/* {setNameValue && (
                                        <p><strong>Set Name:</strong> {setNameValue}</p>
                                    )}
                                    {cardNameValue && (
                                        <p><strong>Card Name:</strong> {cardNameValue}</p>
                                    )}
                                    {cardNumberValue && (
                                        <p><strong>Card Number:</strong> {cardNumberValue}</p>
                                    )}
                                    {rarityValue && (
                                        <p><strong>Rarity:</strong> {rarityValue}</p>
                                    )}
                                    {featureValue && (
                                        <p><strong>Feature:</strong> {featureValue}</p>
                                    )}
                                    {conditionValue && (
                                        <p><strong>Condition:</strong> {conditionValue}</p>
                                    )}
                                    {foilValue && (
                                        <p><strong>Foil/Non Foil:</strong> {foilValue}</p>
                                    )} */}
                                    {/* <div className={cn(contentContainerClass, classes.contentContainerTabOverride)}> */}
                                        <ProductCardDetails
                                            customAttributes={productCardDetailsAttributes.list}
                                        />
                                    {/* </div> */}
                                </div>
                            </ExpandableSection>
                        </section>
                        <section className='right_right-container w-full'>
                            <div className={cn('product_purchase-section', 'border border-[lightgray] rounded-[10px] mb-[15px]')}>
                                <div
                                    className={cn(
                                        'product_price_container',
                                        'flex justify-between flex-wrap gap-y-5'
                                    )}
                                >
                                    <div className='flex flex-col gap-y-2 pl-[1rem] pt-[1rem]'>
                                        <div className='flex flex-col gap-y-1'>
                                            <p
                                                data-cy="ProductFullDetail-productPrice"
                                                className={cn(
                                                    classes.productPrice,
                                                    'text-[24px] font-medium leading-[32px] mb-0',
                                                )}
                                            >
                                                <Price
                                                    currencyCode={productDetails.price.currency}
                                                    priceRange={productDetails.price_range}
                                                    value={productDetails.price.value}
                                                />
                                            </p>
                                        </div>
                                        <AuctionDetail className="auction_detail-container" />
                                        <small className='shipping-calculation-notes text-gray-200 text-xs'>
                                            Shipping is calculated on checkout
                                        </small>
                                        {/* <div className='flex flex-col xs_items-center md_items-start gap-[6px] relative'>
                                            <div className="gap-x-[10px] gap-y-1 flex xs_flex-col md_flex-row xs_items-center md_items-start relative">
                                                <Link to={"/seller/"+sellerDetails.url_key} class="flex items-center justify-center gap-[5px] py-1 relative bg-white">
                                                    <div class="flex items-center justify-center gap-[5px] relative">
                                                        <p>Sold by</p>
                                                        <div class="relative xs_hidden lg_flex w-fit font-medium text-[#f76b1c] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                            {sellerDetails ? sellerDetails.name : ''}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <FormError
                                    classes={{
                                        root: classes.formErrors
                                    }}
                                    errors={errors.get('form') || []}
                                />
                                { options &&
                                    <section className={classes.options}>{options}</section>
                                }
                                <section className={cn(classes.quantity, 'pb-[20px] pt-[10px] !border-none')}>
                                    <div className='product_group-actions flex gap-x-[18px] gap-y-4 pl-[1rem] items-center mt-2 lg_mt-0 mb-6 lg_mb-0'>
                                        <QuantityStepper
                                            min={1}
                                            message={errors.get('quantity')}
                                        />
                                        <Suspense fallback={null}>
                                            <WishlistButton
                                                classes={{
                                                    root: cn(
                                                        'button_share border border-solid border-gray-100 p-2.5',
                                                        'rounded-full flex justify-center items-center h-fitContent min-w-min'
                                                    )
                                                }}
                                                {...wishlistButtonProps}
                                                buttonText={''}
                                            />
                                        </Suspense>
                                    </div>
                                    <PreorderDetail 
                                        preOrder={preOrder}
                                        preOrderDate={preOrderDate}
                                        preOrderDeposite={preOrderDeposite}
                                        preOrderNote={preOrderNote}
                                        preOrderPaymentType={preOrderPaymentType}
                                        releaseDate={releaseDate}    
                                        className={'preorder_detail-container'}
                                        paymentTypeOptions={paymentTypeOptions}
                                        onPaymentTypeChange={setSelectedPaymentType}
                                    />
                                    <div className='product_actions-wrapper'>
                                        {cartActionContent}
                                    </div>
                                </section>
                            </div>
                            <div className={cn('product_otherlink-section', 'border border-[lightgray] rounded-[10px] mb-[15px] p-4')}>
                                <div className='flex flex-col xs_items-center md_items-start gap-[6px] relative'>
                                            <div className="gap-x-[10px] gap-y-1 flex xs_flex-col md_flex-row xs_items-center md_items-start relative">
                                                <Link to={"/seller/"+sellerDetails.url_key} class="flex items-center justify-center gap-[5px] py-1 relative bg-white">
                                                    <div class="flex items-center justify-center gap-[5px] relative">
                                                        <p>Sold by</p>
                                                        <div class="relative xs_hidden lg_flex w-fit font-medium text-[#f76b1c] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                            {sellerDetails ? sellerDetails.name : ''}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className='flex flex-col xs_items-center md_items-start gap-[6px] relative'>
                                            <div className="gap-x-[10px] gap-y-1 flex xs_flex-col md_flex-row xs_items-center md_items-start relative">
                                                <div class="flex items-center justify-center gap-[5px] py-1 relative bg-white">
                                                    <div class="flex items-center justify-center gap-[5px] relative">
                                                        <div className='flex flex-wrap items-start gap-4 relative'>
                                                            <button type="button" onClick={openMessagesModal} class="flex items-center justify-center gap-[5px] py-1 px-5 relative bg-white rounded-[30px] border border-solid border-[#f76b1c]">
                                                                <div class="flex items-center justify-center gap-[10px] relative">
                                                                    <Sms color="#f76b1c" size={14} variant="Outline" className='stroke-[#f76b1c]' />
                                                                    <div class="relative xs_hidden lg_flex w-fit font-medium text-[#f76b1c] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                                        Send Message
                                                                    </div>
                                                                </div>
                                                            </button>
                                                            <Link to={"/seller/"+sellerDetails.url_key} class="flex items-center justify-center gap-[5px] py-1 px-5 relative bg-white rounded-[30px] border border-solid border-[#f76b1c]">
                                                                <div class="flex items-center justify-center gap-[10px] relative">
                                                                    <Shop color="#f76b1c" size={14} variant="Outline" className='stroke-[#f76b1c]' />
                                                                    <div class="relative xs_hidden lg_flex w-fit font-medium text-[#f76b1c] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                                        Visit Store
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                            </div>
                            <div className={cn('product_otherlink-section', 'border border-[lightgray] rounded-[10px] mb-[15px]')}>
                                <LinkToOtherStores productDetails={productDetails} />
                            </div>
                            <section>
                                <div 
                                    className="text-center pt-3 pb-3 cursor-pointer border border-[lightgray] rounded-[10px]"
                                    onClick={() => {
                                        const section = document.getElementById("cross-seller-section");
                                        if (section) {
                                            section.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }}
                                >
                                    <span className="font-bold underline text-[14px]">
                                        View {totalListings} Other Listings
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        As low as ${lowestPrice.toFixed(2)}
                                    </p>
                                </div>
                            </section>
                        </section>
                    </section>
                </section>
            </Form>
            <section className='section_product-details-container mt-8 mb-10'>
                <div className='hidden lg_block'>
                    <Tabs
                        data={dataTabs}
                        tabContentWrapperClassName='!p-0'
                        hasContent
                        tabWrapperClassName='xl_gap-x-[60px] justify-between'
                    />
                </div>
                <div className='block lg_hidden'>
                    <ProductDetailsCollapsible data={dataTabs} />
                </div>
            </section>
            <section id="cross-seller-section" className='w-[calc(100vw-9px)] relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] bg-gray-50 py-[30px] px-0 mb-10'>
                <div className='lg_max-w-[1200px] px-2.5 mx-auto relative max-w-screen-md'>
                    <CrossSeller/>
                </div>
            </section>
            <MessagesModal
                isOpen={isMessagesOpen}
                onClose={closeMessagesModal}
                messages={messagesData?.customer?.sellerMessages}
                seller={sellerDetails}
                onReply={handleReplyMessage}
                onDelete={handleDeleteMessage}
                onSend={handleSendMessage}
                loading={messagesLoading}
            />
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsPageBuilder: string,
        detailsPageBuilderList: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        quantityRoot: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string,
        short_description: shape({
            html: string,
            __typename: string
        })
    }).isRequired
};

export default ProductFullDetail;
// Messages modal attached at root to avoid layout shifts

