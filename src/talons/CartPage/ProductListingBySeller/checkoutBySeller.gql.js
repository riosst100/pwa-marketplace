import { gql } from '@apollo/client';

export const INIT_CHECKOUT_SPLIT_CART_MUTATION = gql`
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

export default {
    initCheckoutSplitCartMutation: INIT_CHECKOUT_SPLIT_CART_MUTATION
};
