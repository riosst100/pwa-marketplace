import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Info } from 'react-feather';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './item.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import ProductLabel from '@riosst100/pwa-marketplace/src/components/ProductLabel';
import AddToCartButton from './addToCartButton';
// eslint-disable-next-line no-unused-vars
import Rating from '@magento/venia-ui/lib/components/Rating';
import cn from 'classnames';
import { Verify } from 'iconsax-react';
import Star from './star';


// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const {
        handleLinkClick,
        item,
        itemRef,
        wishlistButtonProps,
        isSupportedProductType,
        rootClassName
    } = useGalleryItem(props);

    const seller = item.seller ? item.seller.name : '';

    const { storeConfig } = props;

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    // eslint-disable-next-line no-unused-vars
    const { name, price_range, small_image, url_key, rating_summary } = item;

    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton {...wishlistButtonProps} />
    ) : null;

    const addButton = isSupportedProductType ? (
        <AddToCartButton item={item} urlSuffix={productUrlSuffix} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    // fallback to regular price when final price is unavailable
    const priceSource =
        price_range.maximum_price.final_price ||
        price_range.maximum_price.regular_price;

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    const ratingAverage = null;
    // const ratingAverage = rating_summary ? (
    //     <Rating rating={rating_summary} />
    // ) : null;

    return (
        <Link
            aria-label={name}
            onClick={handleLinkClick}
            to={productLink}
            className={rootClassName}
        >
            <div
                data-cy="GalleryItem-root"
                className={cn(
                    classes.root,
                    'border border-gray-100 rounded-lg hover_shadow-type-1 bg-white min-h-[388px]'
                )}
                ref={itemRef}
            >
                <div className={cn('item-product relative z-[1]')}>
                    <ProductLabel />
                    <Link
                        aria-label={name}
                        onClick={handleLinkClick}
                        to={productLink}
                        className={classes.images}
                    >
                        <Image
                            alt={name}
                            classes={{
                                image: classes.image,
                                loaded: classes.imageLoaded,
                                notLoaded: classes.imageNotLoaded,
                                root: classes.imageContainer
                            }}
                            height={IMAGE_HEIGHT}
                            resource={smallImageURL}
                            widths={IMAGE_WIDTHS}
                        />
                        {ratingAverage}
                    </Link>
                </div>
                <div className={cn('item-info px-[15px] pt-[15px] pb-[20px]')}>
                    <Link
                        onClick={handleLinkClick}
                        to={productLink}
                        className={cn(classes.name, 'xs_!no-underline')}
                        data-cy="GalleryItem-name"
                    >
                        <span>{name}</span>
                    </Link>
                    <div data-cy="GalleryItem-price" className={cn(classes.price, 'mb-2.5 pt-2.5')}>
                        <Price
                            value={priceSource.value}
                            currencyCode={priceSource.currency}
                        />
                    </div>

                    <div data-cy="GalleryItem-Rating" className={cn('flex gap-[5px] items-center mb-2')}>
                        <Star />
                        <span className='text-[12px] leading-normal'>
                            {rating_summary}
                        </span>
                    </div>

                    <div data-cy="GalleryItem-Seller" className={cn('flex gap-[5px] items-center')}>
                        <Verify size={17} className='text-blue-700' variant="Bold" />
                        <span className='text-[12px] text-gray-300 leading-normal'>
                            {seller}
                        </span>
                    </div>

                    {/* <div className={classes.actionsContainer}>
                        {' '}
                        {addButton}
                        {wishlistButton}
                    </div> */}
                </div>
            </div>
        </Link>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                final_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }),
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired,
                discount: shape({
                    amount_off: number.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string
    })
};

export default GalleryItem;
