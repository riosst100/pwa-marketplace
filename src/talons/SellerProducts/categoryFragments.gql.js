import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            uid
            name
            preorder {
                is_preorder
                pre_order_payment_type
                pre_order_deposit
                pre_order_notes
                pre_order_date
            }
            auction_data {
                is_auction
            }
            seller {
                name
            }
            custom_attributes {
                selected_attribute_options {
                    attribute_option {
                        uid
                        label
                        is_default
                    }
                }
                entered_attribute_value {
                    value
                }
                attribute_metadata {
                    uid
                    code
                    label
                    attribute_labels {
                        store_code
                        label
                    }
                    data_type
                    is_system
                    entity_type
                    ui_input {
                        ui_input_type
                        is_html_allowed
                    }
                    ... on ProductAttributeMetadata {
                        used_in_components
                    }
                }
            }
            price_range {
                maximum_price {
                    final_price {
                        currency
                        value
                    }
                    regular_price {
                        currency
                        value
                    }
                    discount {
                        amount_off
                    }
                }
                minimum_price {
                    final_price {
                        currency
                        value
                    }
                    regular_price {
                        currency
                        value
                    }
                    discount {
                        amount_off
                    }
                }
            }
            sku
            small_image {
                url
            }
            stock_status
            rating_summary
            __typename
            url_key
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
