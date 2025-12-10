import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;

export const GET_SELLER_DETAIL_QUERY = gql`
    query getSellerDetailForSellerPage($urlKey: String!, $getOtherInfo: Boolean, $getProducts: Boolean) {
        sellerByUrl(seller_url: $urlKey, get_other_info: $getOtherInfo, get_products: $getProducts) {
            seller_id
            contact_number
            shop_title
            company
            term_and_conditions
            website_url
            ship_to
            ship_to_country
            seller_rates {
                total_count
                page_info {
                    current_page
                    page_size
                    total_pages
                }
                items {
                    rating_id
                    seller_id
                    customer_id
                    rate1
                    rate2
                    rate3
                    rate4
                    rate5
                    rating
                    email
                    title
                    status
                    detail
                    nickname
                    created_at
                    verified_buyer
                    is_recommended
                    is_hidden
                    answer
                    admin_note
                    like_about
                    not_like_about
                    guest_email
                    plus_review
                    minus_review
                    report_abuse
                    country
                }
            }
            products {
                total_count
                page_info {
                    current_page
                    page_size
                    total_pages
                }
                items {
                    name
                    sku
                }
            }
            operating_hours {
                day
                status
                time {
                    opening_time
                    closing_time
                }
            }
            store_locators {
                name
                country
                region
                address_line_1
                address_line_2
                city
                postcode
                operating_hours {
                    day
                    status
                    time {
                        opening_time
                        closing_time
                    }
                }
            }
            description
            country
            image
            thumbnail
            city
            region
            group
            group_id
            url
            email
            name
            sale
            creation_time
            page_layout
            status
            position
            twitter_id
            facebook_id
            gplus_id
            youtube_id
            vimeo_id
            instagram_id
            pinterest_id
            linkedin_id
            tw_active
            fb_active
            gplus_active
            vimeo_active
            instagram_active
            pinterest_active
            linkedin_active
            banner_pic
            shop_url
            url_key
            logo_pic
            verify_status
            product_count
            telephone
            creation_time
            update_time
            country_id
            total_sold
            operating_time
            order_processing_time
            shipping_partners
            offers
            benefits
            product_shipping_info
            prepare_time
            response_ratio
            response_time
            store_id
            products {
                total_count
                page_info {
                    page_size
                    current_page
                }
                items {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_COUPON_CODE_QUERY = gql`
    query getSellerCoupons(
        $sellerUrl: String!
        $pageSize: Int
        $currentPage: Int
        $filters: CouponCodeFilterInput
        ) {
        sellerCoupons(
            sellerUrl: $sellerUrl
            pageSize: $pageSize
            currentPage: $currentPage
            filters: $filters
        ) {
            items {
            code
            coupon_id
            couponcode_id
            created_at
            description
            discount_amount
            expiration_date
            from_date
            is_active
            name
            seller_id
            times_used
            to_date
            type
            uses_per_customer
            }
            page_info {
            current_page
            page_size
            total_pages
            }
            total_count
        }
    }
`;

export const GET_CUSTOMER_SELLER_MESSAGES = gql`
    query GetCustomerSellerMessages(
        $pageSize: Int!
        $currentPage: Int!
        $filter: SellerMessageFilterInput
        $sort: SellerMessageSortInput
    ) {
        customer {
            sellerMessages(
                pageSize: $pageSize
                currentPage: $currentPage
                filter: $filter
                sort: $sort
            ) {
                total_count
                page_info {
                    current_page
                    page_size
                    total_pages
                }
                items {
                    message_id
                    subject
                    description
                    sender_email
                    sender_name
                    created_at
                    status
                    is_read
                    sender_id
                    owner_id
                    receiver_id
                    seller_send
                    details(pageSize: 500, currentPage: 1) {
                        total_count
                        items {
                            content
                            sender_name
                            sender_email
                            receiver_name
                            is_read
                            created_at
                        }
                    }
                }
            }
        }
    }
`;

export const CUSTOMER_SEND_MESSAGE_MUTATION = gql`
    mutation CustomerSendMessage($input: CustomerMessageInput!) {
        customerSendMessage(input: $input) {
            message_id
            subject
            description
            sender_name
            sender_email
            created_at
            status
        }
    }
`;

export const CUSTOMER_REPLY_MESSAGE_MUTATION = gql`
    mutation CUSTOMER_REPLY_MESSAGE_MUTATION($input: ReplyMessageInput!) {
        customerReplyMessage(input: $input) {
            content
            sender_name
            sender_email
            receiver_name
            is_read
            created_at
        }
    }
`;

export const CUSTOMER_DELETE_MESSAGE_MUTATION = gql`
    mutation CustomerDeleteMessage($id: Int!) {
        customerDeleteMessage(message_id: $id) {
            message
            code
        }
    }
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getSellerDetailQuery: GET_SELLER_DETAIL_QUERY,
    getCouponCodeQuery: GET_COUPON_CODE_QUERY,
    getCustomerSellerMessages: GET_CUSTOMER_SELLER_MESSAGES,
    customerSendMessageMutation: CUSTOMER_SEND_MESSAGE_MUTATION,
    customerReplyMessageMutation: CUSTOMER_REPLY_MESSAGE_MUTATION,
    customerDeleteMessageMutation: CUSTOMER_DELETE_MESSAGE_MUTATION,
};
