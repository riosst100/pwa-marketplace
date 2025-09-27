import React, { useState, useMemo, Fragment, Suspense, useRef, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';

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
import defaultClasses from './productFullDetail.module.css';
import cn from 'classnames';
import Tabs from '@riosst100/pwa-marketplace/src/components/commons/Tabs';
import ProductReviews from './components/productReview';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { Star1, Verify, Sms, Message, Shop } from 'iconsax-react';
import { Link } from "react-router-dom";
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';

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
        handleAddToCart,
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
        wishlistButtonProps,
        sellerDetails
    } = talonProps;
    
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const [hoveredMedia, setHoveredMedia] = useState(null);

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
        />
    ) : null;
    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

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

    const cartCallToActionText =
        !isEverythingOutOfStock || !isOutOfStock ? (
            <FormattedMessage
                id="productFullDetail.addItemToCart"
                defaultMessage="Add to Cart"
            />
        ) : (
            <FormattedMessage
                id="productFullDetail.itemOutOfStock"
                defaultMessage="Out of Stock"
            />
        );
    // Error message for screen reader
    const cartActionContent = isSupportedProductType ? (
        <section className={cn(classes.actButton, 'flex gap-x-[20px] px-[12px] py-0')}>
           <RFQ
                disabled={isAddToCartDisabled}
                classes={{ rfqButton: classes.rfqButton }}
            />

            <Button
                data-cy="ProductFullDetail-addToCartButton"
                disabled={isAddToCartDisabled}
                aria-disabled={isAddToCartDisabled}
                aria-label={
                    isEverythingOutOfStock
                        ? formatMessage({
                            id: 'productFullDetail.outOfStockProduct',
                            defaultMessage:
                                'This item is currently out of stock'
                        })
                        : ''
                }
                classes={{
                    rootClass: '!px-0 !py-3',
                    content: 'normal-case font-medium text-[14px]'
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

    const ProductMoreInfo = ({ className }) => (
        <>
            <div className={cn(contentContainerClass,  className)}>
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


    const setNameValue = getAttributeValue(customAttributesDetails, "card_set", true);
    const conditionValue = getAttributeValue(customAttributesDetails, "card_condition");

    const ExpandableSection = ({ children, maxHeight = 280 }) => {
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
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t to-transparent pointer-events-none" />
                )}

                {isDesktop && showButton && (
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="mt-2 text-blue-600 font-medium underline focus:outline-none"
                    >
                        {expanded ? "Show Less" : "Read More"}
                    </button>
                )}
            </div>
        );
    };

    const dataTabs =
    [
        {
            id: 'product-detail',
            title: 'Description',
            content: <ProductDescription />
        },
        // {
        //     id: 'product-more-info',
        //     title: 'Details',
        //     content: <ProductMoreInfo />
        // },
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
                                '!font-medium leading-[normal] mb-4 line-clamp-2 !text-[1.5rem]'
                            )}
                            data-cy="ProductFullDetail-productName"
                        >
                            {productDetails.name}
                        </h1>
                        {setNameValue && (
                            <div className="text-gray-400 text-sm mb-2">{setNameValue}</div>
                        )}
                    </div>
                    <section className="bottom_right-container block sm_flex md_flex lg_flex xl_flex 2xl_flex gap-[7px]">
                        <section className='right_left-container'>
                            <ExpandableSection maxHeight={280}>
                                <div
                                    className={cn(
                                        'product_short_description',
                                        'mb-xs',
                                    )}
                                >
                                    <p className="font-bold text-[15px] mb-3">Product Details</p>
                                    {shortDescription}
                                    <ProductMoreInfo className="!mt-0 lg:!mt-0 !p-0" />
                                </div>
                            </ExpandableSection>
                        </section>
                        <section className='right_right-container'>
                            <div className={cn('product_purchase-section', 'border border-[lightgray] rounded-[10px] mb-[15px]')}>
                                <div
                                    className={cn(
                                        'product_price_container',
                                        'flex justify-between flex-wrap gap-y-5'
                                    )}
                                >
                                    <div className='flex flex-col gap-y-3 pl-[1rem] pt-[1.5rem]'>
                                        <div className='flex flex-col gap-y-3'>
                                            {conditionValue && (
                                                <div className="text-gray-600 text-sm mb-1">
                                                    {conditionValue}
                                                </div>
                                            )}
                                            <p
                                                data-cy="ProductFullDetail-productPrice"
                                                className={cn(
                                                    classes.productPrice,
                                                    'text-[32px] font-medium leading-[32px] mb-0',
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
                                        <PreorderDetail className={'preorder_detail-container'} />
                                        <small className='shipping-calculation-notes text-gray-200 text-xs'>
                                            Shipping is calculated on checkout
                                        </small>
                                        <div className='flex flex-col xs_items-center md_items-start gap-[6px] relative'>
                                            <div className="gap-x-[10px] gap-y-1 flex xs_flex-col md_flex-row xs_items-center md_items-start relative">
                                                <Link to={"/seller/"+sellerDetails.url_key} class="flex items-center justify-center gap-[5px] py-1 relative bg-white">
                                                    <div class="flex items-center justify-center gap-[10px] relative">
                                                        <p>Sold by</p>
                                                        <div class="relative xs_hidden lg_flex w-fit font-medium text-[#f76b1c] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                            {sellerDetails ? sellerDetails.name : ''}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
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
                                <section className={cn(classes.quantity, 'py-xs !border-none')}>
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
                                    <div className='product_actions-wrapper'>
                                        {cartActionContent}
                                    </div>
                                </section>
                            </div>
                            <section>
                                <div 
                                    className="text-center pt-3 pb-3 cursor-pointer border border-[lightgray] rounded-[10px] mb-[15px]"
                                    onClick={() => {
                                        const section = document.getElementById("cross-seller-section");
                                        if (section) {
                                            section.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }}
                                >
                                    <span className="font-bold underline">
                                        View {totalListings} Other Listings
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        As low as ${lowestPrice.toFixed(2)}
                                    </p>
                                </div>
                            </section>
                            <div className={cn('product_otherlink-section', 'border border-[lightgray] rounded-[10px]')}>
                                <LinkToOtherStores productDetails={productDetails} />
                            </div>
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
