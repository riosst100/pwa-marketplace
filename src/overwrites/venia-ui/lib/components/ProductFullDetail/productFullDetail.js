import React, { useMemo, Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '../Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '../ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import QuantityStepper from '../QuantityStepper';
// import RichContent from '../RichContent/richContent';
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

const ProductFullDetail = props => {
    const { product } = props;

    const talonProps = useProductFullDetail({ product });

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
        productDetails,
        customAttributes,
        wishlistButtonProps
    } = talonProps;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
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
        const skuAttribute = {
            attribute_metadata: {
                uid: 'attribute_sku',
                used_in_components: ['PRODUCT_DETAILS_PAGE'],
                ui_input: {
                    ui_input_type: 'TEXT'
                },
                label: formatMessage({
                    id: 'global.sku',
                    defaultMessage: 'SKU'
                })
            },
            entered_attribute_value: {
                value: productDetails.sku
            }
        };
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
        list.unshift(skuAttribute);
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
        <section className={classes.actButton}>
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
                    content: 'normal-case font-normal text-base'
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

    const contentContainerClass = 'content-container max-w-[1040px] p-2.5 m-auto relative mt-[34px]'
    const ProductDescription = () => (
        <div className={cn(contentContainerClass)}>
            {/* <span
                data-cy="ProductFullDetail-descriptionTitle"
                className={classes.descriptionTitle}
            >
                <FormattedMessage
                    id={'productFullDetail.description'}
                    defaultMessage={'Description'}
                />
            </span> */}
            {/* <RichContent html={productDetails.description} /> */}
            <RichText
                rootClassName="px-0"
                content={productDetails.description}
            />
        </div>
    );

    const ProductMoreInfo = () => (
        <>
            <div className={cn(contentContainerClass)}>
                <span
                    data-cy="ProductFullDetail-detailsTitle"
                    className={classes.detailsTitle}
                >
                    <FormattedMessage
                        id={'productFullDetail.details'}
                        defaultMessage={'Details'}
                    />
                </span>
                <CustomAttributes
                    customAttributes={customAttributesDetails.list}
                />
            </div>
            {pageBuilderAttributes}
        </>
    );

    const ProductTNC = () => (
        <div className={cn(contentContainerClass)}>
            <p>
                Terms and Conditions
            </p>
        </div>
    )

    const ProductFAQ = () => (
        <div className={cn(contentContainerClass)}>
            <p>
                Frequently Ask Question
            </p>
        </div>
    )


    const dataTabs =
        [
            {
                id: 'product-detail',
                title: 'Details',
                content: <ProductDescription />
            },
            {
                id: 'product-more-info',
                title: 'More Info',
                content: <ProductMoreInfo />
            },
            {
                id: 'product-tnc',
                title: 'Terms & Conditions',
                content: <ProductTNC />
            },
            {
                id: 'product-faq',
                title: 'FAQ',
                content: <ProductFAQ />
            },
            {
                id: 'product-reviews',
                title: 'Reviews',
                content: <ProductReviews className={cn(contentContainerClass)} />
            }
        ];

    return (
        <Fragment>
            {breadcrumbs}
            <Form
                className={classes.root}
                data-cy="ProductFullDetail-root"
                onSubmit={handleAddToCart}
            >
                <section className={classes.leftContainer}>
                    <Carousel images={mediaGalleryEntries} />
                    <div className='product_group-actions'>
                        <Suspense fallback={null}>
                            <WishlistButton {...wishlistButtonProps} />
                        </Suspense>
                    </div>
                </section>
                <section className={classes.rightContainer}>
                    <div
                        className={cn(
                            classes.title,
                            'mb-[30px]',
                        )}
                    >
                        <h1
                            aria-live="polite"
                            className={cn(
                                classes.productName,
                                '!font-semibold leading-[normal] mb-4 line-clamp-2'
                            )}
                            data-cy="ProductFullDetail-productName"
                        >
                            {productDetails.name}
                        </h1>
                        <div className='product_review-container flex items-center gap-x-2'>
                            <div className='product_rating leading-[14px] flex items-center gap-x-[5px]'>
                                <span className="w-3.5 h-3.5 relative">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                </span>
                                <span className='text-gray-200 text-sm'>
                                    {rating_value}
                                </span>
                            </div>
                            <div className='before_block before_w-[1px] before_bg-gray-200 before_h-full before_relative w-[1px] h-[14px]'></div>
                            <span className='review_count text-gray-200 text-sm leading-[14px]'>
                                {review_count} Reviews
                            </span>
                        </div>
                    </div>
                    <div
                        className={cn(
                            'product_short_description',
                            'mb-[30px]',
                        )}
                    >
                        {shortDescription}
                    </div>
                    <div className='product_brand-container mb-[30px] leading-[18px]'>
                        <div className='text-sm'>
                            Brand : <span className='text-blue-700'><Link to="">Bandai Namco</Link></span>
                        </div>
                    </div>
                    <Divider />
                    <div
                        className={cn(
                            'product_price_container',
                            'py-[30px]'
                        )}
                    >
                        <p
                            data-cy="ProductFullDetail-productPrice"
                            className={cn(
                                classes.productPrice,
                                'text-[32px] font-semibold leading-[32px] mb-[15px]',
                            )}
                        >
                            <Price
                                currencyCode={productDetails.price.currency}
                                value={productDetails.price.value}
                            />
                        </p>
                        <small className='shipping-calculation-notes text-gray-200 text-xs'>
                            Shipping method is calculated on checkout
                        </small>
                    </div>
                    <Divider />
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={errors.get('form') || []}
                    />
                    <section className={classes.options}>{options}</section>
                    <section className={cn(classes.quantity, 'py-[30px] !border-none')}>
                        {/* <span
                            data-cy="ProductFullDetail-quantityTitle"
                            className={classes.quantityTitle}
                        >
                            <FormattedMessage
                                id={'global.quantity'}
                                defaultMessage={'Quantity'}
                            />
                        </span> */}
                        <QuantityStepper
                            min={1}
                            message={errors.get('quantity')}
                        />

                        <div className='product_shipping-information mb-[30px] leading-[18px] mt-[25px]'>
                            <div className='text-xs'>
                                Shiping From <span className='font-semibold'>Singapore</span>
                            </div>
                            <div className='text-xs'>
                                Shiping To <span className='font-semibold'>Yishun</span>
                            </div>
                            <div className='text-xs'>
                                Shiping Method <span className='font-semibold'>Store Pick Up | Meet Up</span>
                            </div>
                        </div>

                        <div className='product_actions-wrapper'>
                            {cartActionContent}
                        </div>
                    </section>
                    <Divider />
                    <section className='product_from-other-platform py-[30px]'>
                        <div className='text-sm flex mb-5'>
                            Also available in
                        </div>
                        <div className='platform-container flex gap-x-2.5'>
                            <Link
                                className='platform_logo-wrapper rounded-md px-5 py-2.5 border border-gray-100 flex items-center'
                                to=""
                            >
                                <img
                                    alt="tokopedia"
                                    width={60}
                                    height={30}
                                    src={'https://upload.wikimedia.org/wikipedia/commons/a/a7/Tokopedia.svg'}
                                />
                            </Link>
                            <Link
                                className='platform_logo-wrapper rounded-md px-5 py-2.5 border border-gray-100 flex items-center'
                                to=""
                            >
                                <img
                                    alt="shopee"
                                    width={60}
                                    height={30}
                                    src={'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg'}
                                />
                            </Link>
                        </div>
                    </section>
                    <Divider />
                    <section className='seller-information py-[30px]'>
                        <div className='flex xs_flex-col md_flex-row xs_items-center md_items-start items-start gap-[15px] relative'>
                            <div className='flex flex-row justify-between relative w-full'>
                                <div className='flex flex-col xs_items-center md_items-start gap-[6px] relative'>
                                    <div className="gap-x-[10px] gap-y-1 flex xs_flex-col md_flex-row xs_items-center md_items-start relative">
                                        <div className="text-sm">
                                            Good Smile
                                        </div>
                                        <div className="flex items-center relative">
                                            <Verify variant='Bold' color='#4E31DB' size={20} />
                                        </div>
                                    </div>
                                    <div class="relative w-fit font-normal text-[#999999] text-[12px] tracking-[0] leading-[14px] whitespace-nowrap">
                                        Jurong West
                                    </div>
                                </div>
                                <div className='flex flex-wrap items-start gap-4 relative'>
                                    <button class="flex items-center justify-center gap-[5px] py-1 px-5 relative bg-white rounded-[30px] border border-solid border-[#6243fa]">
                                        <div class="flex items-center justify-center gap-[10px] relative">
                                            <Sms color="#6243FA" size={14} variant="Outline" className='stroke-[#6243FA]' />
                                            <div class="relative xs_hidden lg_flex w-fit font-medium text-[#6243fa] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                Message
                                            </div>
                                        </div>
                                    </button>
                                    <button class="flex items-center justify-center gap-[5px] py-1 px-5 relative bg-[#280135] rounded-[30px] border border-solid border-[#280135]">
                                        <div class="flex items-center justify-center gap-[10px] relative">
                                            <Message color='#FFFFFF' size={14} variant="Outline" className='stroke-[#FFFFFF]' />
                                            <div class="relative xs_hidden lg_flex w-fit font-medium text-[#fff] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                Chat With Seller
                                            </div>
                                        </div>
                                    </button>
                                    <button class="flex items-center justify-center gap-[5px] py-1 px-5 relative bg-white rounded-[30px] border border-solid border-[#6243fa]">
                                        <div class="flex items-center justify-center gap-[10px] relative">
                                            <Shop color="#6243FA" size={14} variant="Outline" className='stroke-[#6243FA]' />
                                            <div class="relative xs_hidden lg_flex w-fit font-medium text-[#6243fa] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                                Visit Store
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Divider />
                </section>
            </Form>
            <section className='section_product-details-container my-8'>
                <Tabs
                    data={dataTabs}
                    tabContentWrapperClassName='!p-0'
                    hasContent
                    tabWrapperClassName='xl_gap-x-[60px] justify-center'
                />
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
