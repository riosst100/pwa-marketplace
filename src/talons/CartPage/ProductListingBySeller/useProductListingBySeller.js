import { useCallback, useMemo, useState, useEffect } from 'react';
import { useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import debounce from 'lodash.debounce';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '@riosst100/pwa-marketplace/src/talons/CartPage/ProductListingBySeller/checkoutBySeller.gql';

export const useProductListingBySeller = props => {
    const { initialValue, min, onChange } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const {
        initCheckoutSplitCartMutation
    } = operations;

    const [
        initCheckoutSplitCart,
        {
            loading: initCheckoutSplitCartLoading,
            error: initCheckoutSplitCartError,
            called: initCheckoutSplitCartCalled
        }
    ] = useMutation(initCheckoutSplitCartMutation);

    const [displayError, setDisplayError] = useState(false);

    const [, { dispatch }] = useEventingContext();

    const handleSellerToCheckout = useCallback(
        async (sellerUrl, cartId) => {
            try {
                // await initCheckoutSplitCart({
                //     variables: {
                //         seller_url: sellerUrl,
                //         cart_id: cartId
                //     }
                // });

                // const selectedOptions =
                //     item.configurable_options?.map(
                //         ({ option_label, value_label }) => ({
                //             attribute: option_label,
                //             value: value_label
                //         })
                //     ) || null;

                // dispatch({
                //     type: quantity ? 'CART_UPDATE_ITEM' : 'CART_REMOVE_ITEM',
                //     payload: {
                //         cartId,
                //         sku: item.product.sku,
                //         name: item.product.name,
                //         priceTotal: item.prices.price.value,
                //         currencyCode: item.prices.price.currency,
                //         discountAmount: item.prices.total_item_discount.value,
                //         selectedOptions,
                //         quantity: quantity || item.quantity
                //     }
                // });
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [dispatch, initCheckoutSplitCart]
    );

    return {
        handleSellerToCheckout
    };
};