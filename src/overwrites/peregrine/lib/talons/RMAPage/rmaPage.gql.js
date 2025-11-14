import { gql } from '@apollo/client';

const LofmpRmasFragment = gql`
    fragment LofmpRmasFragment on RmaSearchResult {
        items {
            created_at
            increment_id
            items {
                condition
                id
                image_url
                name
                price {
                    currency
                    value
                }
                qty_requested
                reason
                resolution
                seller_name
                sku
            }
            order {
                created_at
                id
                increment_id
                status
                status_label
            }
            order_increment_id
            rma_date
            rma_id
            seller {
                id
                name
                url
            }
            status
            status_label
        }
        total_count
    }
`;

export const LOFMP_SEND_RMA_MESSAGE = gql`
    mutation lofmpSendRmaMessage($input: SendMessageInput!) {
        lofmpSendRmaMessage(input: $input) {
            created_message {
                attachments {
                    id
                    name
                    url
                }
                created_at
                id
                sender_email
                sender_name
                text
            }
            message
            success
        }
    }
`;

export const LOFMP_RMA_SHIPPING_CONFIRM = gql`
    mutation lofmpRmaShippingConfirm($rma_id: Int!) {
        lofmpRmaShippingConfirm(rma_id: $rma_id) {
            message
            success
        }
    }
`;

export const GET_LOFMP_RMA_CONFIGURATIONS = gql`
    query GetLofmpRmaConfigurations {
        lofmpRmaConfigurations {
            conditions {
                id
                name
            }
            reasons {
                id
                name
            }
            resolutions {
                id
                name
            }
        }
    }
`;

export const GET_LOFMP_RMAS = gql`
    query GetLofmpRmas($filter: RmaFilterInput, $pageSize: Int!, $currentPage: Int) {
        lofmpRmas(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
            ...LofmpRmasFragment
        }
    }
    ${LofmpRmasFragment}
`;

export const LOFMP_CREATE_RMA = gql`
    mutation lofmpCreateRma($input: CreateRmaInput!) {
        lofmpCreateRma(input: $input) {
            message
            rma_id
            status_id
            success
        }
    }
`;

export const GET_LOFMP_RMA_DETAIL = gql`
    query GetLofmpRmaDetail($rmaId: ID!) {
        lofmpRmaDetail(rmaId: $rmaId) {
            created_at
            increment_id
            items {
                condition
                id
                image_url
                name
                product_options {
                    label
                    value
                }
                qty_requested
                reason
                resolution
                sku
            }
            messages {
                attachments {
                    id
                    name
                    url
                }
                created_at
                id
                sender_email
                sender_name
                text
            }
            order {
                created_at
                id
                increment_id
                status
                status_label
            }
            order_increment_id
            rma_date
            rma_id
            seller {
                id
                name
                url
            }
            shipping_address {
                address_type
                base_cash_on_delivery
                cash_on_delivery
                city
                company
                country_id
                customer_address_id
                customer_id
                email
                entity_id
                fax
                firstname
                lastname
                middlename
                parent_id
                postcode
                prefix
                quote_address_id
                region
                region_id
                street
                suffix
                telephone
                vat_id
                vat_is_valid
                vat_request_date
                vat_request_id
                vat_request_success
            }
            status
            status_label
        }
    }
`;

export default {
    getLofmpRmasQuery: GET_LOFMP_RMAS,
    lofmpCreateRmaMutation: LOFMP_CREATE_RMA,
    getLofmpRmaDetailQuery: GET_LOFMP_RMA_DETAIL,
    lofmpRmaShippingConfirmMutation: LOFMP_RMA_SHIPPING_CONFIRM,
    lofmpSendRmaMessageMutation: LOFMP_SEND_RMA_MESSAGE
};
