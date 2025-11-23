import { gql } from '@apollo/client';
import { CheckoutPageFragment } from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPageFragments.gql';
import { ItemsReviewFragment } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/itemsReviewFragments.gql';

// Local fragment to include seller_url for each item.
export const ITEM_SELLER_FRAGMENT = gql`
    fragment ItemSellerFragment on Cart {
        items {
            seller {
                seller_url
            }
        }
    }
`;

export const CREATE_CART = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export const PLACE_ORDER = gql`
    mutation placeOrder($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) {
            order {
                order_number
            }
        }
    }
`;

// Extended to include selected_payment_method.code
export const GET_ORDER_DETAILS = gql`
    query getOrderDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            email
            total_quantity
            shipping_addresses {
                firstname
                lastname
                street
                city
                region { label }
                postcode
                country { label }
                selected_shipping_method {
                    amount { value currency }
                    carrier_title
                    method_title
                }
            }
            selected_payment_method {
                code
                purchase_order_number
                title
            }
            prices {
                grand_total { value currency }
                discounts {
                    amount { currency value }
                    label
                }
            }
            ...ItemsReviewFragment
            ...ItemSellerFragment
        }
    }
    ${ItemsReviewFragment}
    ${ITEM_SELLER_FRAGMENT}
`;

export const GET_CHECKOUT_DETAILS = gql`
    query getCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CheckoutPageFragment
            ...ItemsReviewFragment
            ...ItemSellerFragment
        }
    }
    ${CheckoutPageFragment}
    ${ItemsReviewFragment}
    ${ITEM_SELLER_FRAGMENT}
`;

export const GET_CUSTOMER = gql`
    query GetCustomerForCheckout {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            default_shipping
            firstname
        }
    }
`;

export default {
    createCartMutation: CREATE_CART,
    getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
    getCustomerQuery: GET_CUSTOMER,
    getOrderDetailsQuery: GET_ORDER_DETAILS,
    placeOrderMutation: PLACE_ORDER,
    itemSellerFragment: ITEM_SELLER_FRAGMENT
};
