import { gql } from '@apollo/client';
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;

const INIT_CHECKOUT_SPLIT_CART_MUTATION = gql`
    mutation InitCheckoutSplitCart(
        $input: SubmitSplitCartInput!
    ) {
        initCheckoutSplitCart(
            input: $input
        ) {
            id
            parent_id
            quote_id
            is_active
            is_ordered
        }
    }
`;

export const CREATE_CART = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export default {
    getPriceSummaryQuery: GET_PRICE_SUMMARY,
    initCheckoutSplitCartMutation: INIT_CHECKOUT_SPLIT_CART_MUTATION,
    createCartMutation: CREATE_CART
};