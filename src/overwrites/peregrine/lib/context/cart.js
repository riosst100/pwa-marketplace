import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import { connect } from 'react-redux';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import actions from '@magento/peregrine/lib/store/actions/cart/actions';
import * as asyncActions from '@magento/peregrine/lib/store/actions/cart/asyncActions';
import bindActionCreators from '@magento/peregrine/lib/util/bindActionCreators';
import { useEventListener } from '@magento/peregrine/lib/hooks/useEventListener';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const CartContext = createContext();

const isCartEmpty = cart =>
    !cart || !cart.details.items || cart.details.items.length === 0;

const getTotalQuantity = items =>
    items.reduce((total, item) => total + item.quantity, 0);

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    // Make deeply nested details easier to retrieve and provide empty defaults
    const derivedDetails = useMemo(() => {
        if (isCartEmpty(cartState)) {
            return {
                currencyCode: 'USD',
                numItems: 0,
                subtotal: 0
            };
        } else {
            return {
                currencyCode: cartState.details.prices.grand_total.currency,
                numItems: getTotalQuantity(cartState.details.items),
                subtotal: cartState.details.prices.grand_total.value
            };
        }
    }, [cartState]);

    const cartApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => {
        const derivedCartState = {
            ...cartState,
            isEmpty: isCartEmpty(cartState),
            derivedDetails
        };

        return [derivedCartState, cartApi];
    }, [cartApi, cartState, derivedDetails]);

    const [fetchCartId] = useMutation(CREATE_CART_MUTATION);
    const [removeSplitCart] = useMutation(REMOVE_SPLIT_CART_MUTATION);
    const fetchCartDetails = useAwaitQuery(CART_DETAILS_QUERY);

    const websiteCodes = [];

    AVAILABLE_WEBSITES.forEach(store => {
        websiteCodes.push(store.website_code);
    });
    
    const { location } = globalThis;
    const match = location && location.pathname.split("/")[1];
    const websiteCodeInUrl = websiteCodes.find((str) => str === match);

    let prefix = websiteCodeInUrl ? websiteCodeInUrl + '_' : '';

    // Storage listener to force a state update if cartId changes from another browser tab.
    const storageListener = useCallback(() => {
        const storage = new BrowserPersistence();
        const currentCartId = storage.getItem(prefix + 'cartId');
        const { cartId } = cartState;
        if (cartId && currentCartId && cartId !== currentCartId) {
            globalThis.location && globalThis.location.reload();
        }
    }, [cartState]);

    useEventListener(globalThis, 'storage', storageListener);

    useEffect(() => {
        // cartApi.getCartDetails initializes the cart if there isn't one.
        cartApi.getCartDetails({
            fetchCartId,
            fetchCartDetails,
            removeSplitCart
        });
    }, [cartApi, fetchCartDetails, fetchCartId]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

const mapStateToProps = ({ cart }) => ({ cartState: cart });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartContextProvider);

export const useCartContext = () => useContext(CartContext);

/**
 * We normally do not keep GQL queries in Peregrine. All components should pass
 * queries to talons/hooks. This is an exception to the rule because it would
 * be unecessarily complex to pass these queries to the context provider.
 */
const CREATE_CART_MUTATION = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;

const REMOVE_SPLIT_CART_MUTATION = gql`
    mutation removeSplitCart($input: removeSplitCartInput!) {
        removeSplitCart(input: $input)
    }
`;

const CART_DETAILS_QUERY = gql`
    query checkUserIsAuthed($cartId: String!) {
        cart(cart_id: $cartId) {
            # The purpose of this query is to check that the user is authorized
            # to query on the current cart. Just fetch "id" to keep it small.
            id
        }
    }
`;
