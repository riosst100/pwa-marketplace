import { gql } from '@apollo/client';

export const CREATE_QUICK_RFQ_MUTATION = gql`
    mutation CreateQuickRfq($input: QuickrfqInput!) {
        createQuickrfq(input: $input) {
            message
            quickrfq_id
            success
        }
    }
`;

export const GET_QUICK_RFQ_LIST_QUERY = gql`
    query getQuickRfqList($pageSize: Int, $currentPage: Int) {
        quickrfqList(pageSize: $pageSize, currentPage: $currentPage) {
            items {
                attachment
                attachments {
                    created_at
                    entity_id
                    file_name
                    file_path
                    file_type
                    message_id
                    quickrfq_id
                }
                attributes
                cart_id
                comment
                contact_name
                create_date
                email
                info_buy_request
                messages {
                    created_at
                    customer_id
                    entity_id
                    is_main
                    message
                    quickrfq_id
                }
                overview
                phone
                price_per_product {
                    currency
                    value
                }
                product_id
                product_name
                quantity
                quickrfq_id
                status
                store_currency_code
                store_id
                update_date
                website_id
            }
            page_info {
                current_page
                filter_group
                hide_title
                page_size
                title
            }
            total_count
        }
    }
`;

export const GET_QUICK_RFQ_DETAIL_QUERY = gql`
    query getQuickRfqDetail($quickrfqId: Int!) {
        quickrfqDetail(quickrfq_id: $quickrfqId) {
            admin_price {
                currency
                value
            }
            admin_quantity
            attachment
            attachments {
                created_at
                entity_id
                file_name
                file_path
                file_type
                message_id
                quickrfq_id
            }
            attributes
            cart_id
            comment
            contact_name
            coupon_code
            create_date
            date_need_quote
            email
            expiry
            info_buy_request
            messages {
                created_at
                customer_id
                entity_id
                is_main
                message
                quickrfq_id
            }
            overview
            phone
            price_per_product {
                currency
                value
            }
            product_id
            product_name
            product_sku
            quantity
            quickrfq_id
            seller_id
            seller_name
            status
            store_currency_code
            store_id
            update_date
            user_id
            user_name
            website_id
        }
    }
`;

export const SEND_RFQ_MESSAGE_MUTATION = gql`
    mutation sendRfqMessage($input: SendRfqMessageInput!) {
        sendRfqMessage(input: $input) {
            message
            rfq_message {
                attachments {
                    created_at
                    file_name
                    file_path
                    file_type
                    id
                    message_id
                    quickrfq_id
                }
                created_at
                customer_id
                id
                is_main
                message
                quickrfq_id
            }
            success
        }
    }
`;

export const CONVERT_QUICK_RFQ_TO_CART_MUTATION = gql`
    mutation convertQuickrfqToCart($quickrfqId: Int!) {
        convertQuickrfqToCart(quickrfq_id: $quickrfqId) {
            cart_id
            masked_cart_id
            message
            quickrfq_id
            rfq_status
            status
        }
    }
`;

export const CREATE_CART = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export default {
    createCartMutation: CREATE_CART,
    convertQuickrfqToCartMutation: CONVERT_QUICK_RFQ_TO_CART_MUTATION,
    sendRfqMessageMutation: SEND_RFQ_MESSAGE_MUTATION,
    getQuickRfqDetailQuery: GET_QUICK_RFQ_DETAIL_QUERY,
    getQuickRfqListQuery: GET_QUICK_RFQ_LIST_QUERY,
    createQuickRfqMutation: CREATE_QUICK_RFQ_MUTATION,
};
