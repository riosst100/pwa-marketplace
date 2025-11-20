import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { setCheckoutState } from '@magento/peregrine/lib/store/actions/cart';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './priceSummary.gql';
import {
    useApolloClient,
    useMutation,
    useQuery
} from '@apollo/client';

/**
 * @ignore
 *
 * Flattens query data into a simple object. We create this here rather than
 * having each line summary line component destructure its own data because
 * only the parent "price summary" component knows the data structure.
 *
 * @param {Object} data query data
 */
const flattenData = data => {
    if (!data) return {};
    return {
        subtotal: data.cart.prices.subtotal_excluding_tax,
        total: data.cart.prices.grand_total,
        discounts: data.cart.prices.discounts,
        giftCards: data.cart.applied_gift_cards,
        giftOptions: data.cart.prices.gift_options,
        taxes: data.cart.prices.applied_taxes,
        shipping: data.cart.shipping_addresses,
        payment_fees: data.cart.payment_fees
    };
};

/**
 * This talon contains logic for a price summary component.
 * It performs effects and returns prop data for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Log a GraphQL error if it occurs when getting the price summary
 *
 * @function
 *
 * @param {Object} props
 * @param {PriceSummaryQueries} props.queries GraphQL queries for a price summary component.
 *
 * @returns {PriceSummaryTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
 */
export const usePriceSummary = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getPriceSummaryQuery, initCheckoutSplitCartMutation, createCartMutation } = operations;

    const apolloClient = useApolloClient();

    const [{ cartId }, { createSellerCart, createCart, removeCart }] = useCartContext();
    const history = useHistory();
    // We don't want to display "Estimated" or the "Proceed" button in checkout.
    const match = useRouteMatch('/checkout');
    const isCheckout = !!match;

    const { error, loading, data } = useQuery(getPriceSummaryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    const [
        initCheckoutSplitCart,
        {
            loading: initCheckoutSplitCartLoading,
            data: initCheckoutSplitCartData,
            error: initCheckoutSplitCartError,
            called: initCheckoutSplitCartCalled
        }
    ] = useMutation(initCheckoutSplitCartMutation);

    const [fetchCartId] = useMutation(createCartMutation);

    const handleProceedToCheckout = useCallback(async(props) => {
        const { sellerUrl } = props;

        // await initCheckoutSplitCart({
        //     variables: {
        //         input: {
        //             seller_url: sellerUrl,
        //             cart_id: cartId
        //         }
        //     }
        // });

        await setCheckoutState(true);

        await createSellerCart({ initCheckoutSplitCart, sellerUrl });

        await removeCart();
        await apolloClient.clearCacheData(apolloClient, 'cart');

        await createCart({
            fetchCartId
        });
        
        history.push('/checkout');
    }, [history, setCheckoutState, createSellerCart, fetchCartId, createCart, apolloClient, removeCart, cartId, initCheckoutSplitCart, initCheckoutSplitCartData]);

    const handleEnterKeyPress = useCallback(() => {
        event => {
            if (event.key === 'Enter') {
                handleProceedToCheckout();
            }
        };
    }, [handleProceedToCheckout]);

    return {
        handleProceedToCheckout,
        handleEnterKeyPress,
        hasError: !!error,
        hasItems: data && !!data.cart.items.length,
        isCheckout,
        isLoading: !!loading,
        flatData: flattenData(data)
    };
};

/** JSDocs type definitions */

/**
 * Query data flattened into a simple object.
 *
 * @typedef {Object} FlattenedData
 *
 * @property {String} subtotal Cart subtotal (excluding tax)
 * @property {String} total Cart grand total
 * @property {Array<Object>} discounts Applied discounts to the cart
 * @property {Array<Object>} giftCards Gift cards applied to the cart
 * @property {Array<Object>} giftOptions Gift Options applied to the cart
 * @property {Array<Object>} taxes Taxes applied to the cart
 * @property {Array<Object>} shipping Shipping addresses associated with this cart
 */

/**
 * GraphQL queries for price summary component.
 *
 * @typedef {Object} PriceSummaryQueries
 *
 * @property {GraphQLAST} getPriceSummary Query to get the price summary for a cart
 *
 * @see [priceSummary.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js}
 * for the queries used in Venia.
 */

/**
 * Props used for rendering a price summary component.
 *
 * @typedef {Object} PriceSummaryTalonProps
 *
 * @property {function} handleProceedToCheckout Callback function which navigates the browser to the checkout
 * * @property {function} handleEnterKeyPress Callback function which navigates the browser to the checkout at the press of enter key
 * @property {boolean} hasError True if a GraphQL query returns an error. False otherwise.
 * @property {boolean} hasItems True if the cart has any items. False otherwise.
 * @property {boolean} isLoading True while the GraphQL query is still in flight. False otherwise.
 * @property {FlattenedData} flatData Query data that has been flattened into a simple object
 *
 */
