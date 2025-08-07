import React, { Fragment, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import defaultClasses from './productListing.module.css';
import ProductListingBySeller from '../ProductListingBySeller/productListingBySeller';
import ErrorMessage from './errorMessage';
import cn from 'classnames';

const EditModal = React.lazy(() => import('./EditModal'));
/**
 * A child component of the CartPage component.
 * This component renders the product listing on the cart page.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [productListing.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/productListing.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import ProductListing from "@magento/venia-ui/lib/components/CartPage/ProductListing";
 */
const ProductListing = props => {
    const {
        onAddToWishlistSuccess,
        setIsCartUpdating,
        fetchCartDetails,
        isCartUpdating,
        hasItems
    } = props;

    const talonProps = useProductListing();

    const {
        activeEditItem,
        isLoading,
        error,
        items,
        setActiveEditItem,
        wishlistConfig
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'productListing.loading'}
                    defaultMessage={'Fetching Cart...'}
                />
            </LoadingIndicator>
        );
    }

    // Grouping berdasarkan seller_id dengan data seller di atas
    const groupedItems = items.reduce((acc, item) => {
        if (!item.seller) {
            return [];
        }
        
        const { seller_id, seller_name, seller_url } = item.seller;
        
        if (!acc[seller_id]) {
            acc[seller_id] = {
                seller: {
                seller_id,
                seller_name,
                seller_url
                },
                items: []
            };
        }
    
        acc[seller_id].items.push(item);
        return acc;
    }, {});
    
    // Ubah hasil ke dalam array
    const itemsBySeller = Object.values(groupedItems);

    if (itemsBySeller.length) {
        const productBySellerComponents = itemsBySeller.map((sellerItems, index) => (
            <ProductListingBySeller 
                onAddToWishlistSuccess={onAddToWishlistSuccess} 
                activeEditItem={activeEditItem}
                isLoading={isLoading}
                hasItems={hasItems}
                key={index}
                error={error}
                setActiveEditItem={setActiveEditItem}
                wishlistConfig={wishlistConfig}
                setIsCartUpdating={setIsCartUpdating} 
                fetchCartDetails={fetchCartDetails} 
                seller={sellerItems.seller}
                isCartUpdating={isCartUpdating}
                items={sellerItems.items} />
        ));

        return (
            <Fragment>
                {productBySellerComponents}
            </Fragment>
        );
    }

    return null;
};

export default ProductListing;
