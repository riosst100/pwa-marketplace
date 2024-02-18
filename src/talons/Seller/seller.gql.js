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
            seller_rates {
                total_count
                page_info {
                    page_size
                    current_page
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

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getSellerDetailQuery: GET_SELLER_DETAIL_QUERY
};
