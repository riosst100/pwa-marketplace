import React, { Fragment, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import defaultClasses from './productListingBySeller.module.css';
import Product from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/CartPage/ProductListing/product';
import ErrorMessage from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/CartPage/ProductListing/errorMessage';
import cn from 'classnames';
import { useProductListingBySeller } from '@riosst100/pwa-marketplace/src/talons/CartPage/ProductListingBySeller/useProductListingBySeller';
import { Shop, ArrowRight2 } from 'iconsax-react';
import PriceSummary from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/CartPage/PriceSummary';

const EditModal = React.lazy(() => import('@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/CartPage/ProductListing/EditModal'));
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
const ProductListingBySeller = props => {
    const {
        onAddToWishlistSuccess,
        isCartUpdating,
        hasItems,
        setIsCartUpdating,
        fetchCartDetails,
        activeEditItem,
        setIsProceedToCheckout,
        isProceedToCheckout,
        setActiveEditItem,
        wishlistConfig,
        isLoading,
        error,
        seller,
        items
    } = props;

    const talonProps = useProductListingBySeller({
        
    });

    const {
        handleSellerToCheckout
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

    if (items.length) {
        const productComponents = items.map(product => (
            <Product
                item={product}
                key={product.uid}
                setActiveEditItem={setActiveEditItem}
                setIsCartUpdating={setIsCartUpdating}
                onAddToWishlistSuccess={onAddToWishlistSuccess}
                fetchCartDetails={fetchCartDetails}
                wishlistConfig={wishlistConfig}
            />
        ));
 
        const priceSummary = hasItems ? (
            <PriceSummary isProceedToCheckout={isProceedToCheckout} setIsProceedToCheckout={setIsProceedToCheckout} setIsCartUpdating={setIsCartUpdating} isUpdating={isCartUpdating} sellerUrl={seller.seller_url} />
        ) : null;
        return (
            <Fragment>
                <ErrorMessage error={error} />
                <ul className={cn(classes.root, 'mb-5 border border-gray-100 rounded-md')} data-cy="ProductListing-root">
                    <div className='px-6'>
                        <div className={cn(classes.sellerTitleContainer, 'border-b border-gray-100')}>
                            {/* <input type="checkbox" className={classes.sellerCheckbox} onChange={handleSellerToCheckout(seller.seller_url, null)}/> */}
                            <Link
                                to={resourceUrl('/seller/' + seller.seller_url)}
                                className={classes.seller_title}
                            ><span style={{
                                "display": "flex",
                                "gap": "7px"
                            }}>
                                 {seller?.seller_name}</span></Link>
                        </div>
                        {productComponents}
                        <div className={classes.subtotalContainer}>
                            <div className={classes.subtotalLabel}>Subtotal:</div>
                            <div className={classes.subtotalAmount}>
                                {seller.seller_currency || 'SGD'} {items.reduce((total, item) => {
                                    const itemPrice = item?.prices?.price?.value || 0;
                                    const quantity = item?.quantity || 0;
                                    return total + (itemPrice * quantity);
                                }, 0).toFixed(2)}
                            </div>
                        </div>
                        <div className={classes.summary_container}>
                            <div className={classes.summary_contents}>
                                {priceSummary}
                            </div>
                        </div>
                    </div>
                </ul>
                <Suspense fallback={null}>
                    <EditModal
                        item={activeEditItem}
                        setIsCartUpdating={setIsCartUpdating}
                        setActiveEditItem={setActiveEditItem}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return null;
};

export default ProductListingBySeller;
