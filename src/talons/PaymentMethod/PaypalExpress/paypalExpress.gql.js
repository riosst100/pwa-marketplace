import {gql} from '@apollo/client';

export const SelectedPaymentMethodsFragment = gql`
    fragment SelectedPaymentMethodsFragment on Cart {
        id
        selected_payment_method {
            code
            title
        }
    }
`;


export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $selectedMethod: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: $selectedMethod } }
        ) @connection(key: "setPaymentMethodOnCart") {
            cart {
                ...SelectedPaymentMethodsFragment
            }
        }
    }
    ${SelectedPaymentMethodsFragment}
`;

export default {
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};