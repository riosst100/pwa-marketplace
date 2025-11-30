import { gql } from '@apollo/client';

export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        categories {
            uid
            breadcrumbs {
                category_uid
            }
        }
        link_to_other_stores
        seller {
            name
            url_key
            city
            country
        }
        description {
            html
        }
        short_description {
            html
        }
        id
        uid
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        media_gallery_entries {
            uid
            label
            position
            disabled
            file
        }
        meta_description
        name
        special_price
        special_from_date
        special_to_date
        price {
            regularPrice {
                amount {
                    currency
                    value
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
        publish_status
        sku
        auction_data {
            is_auction
            status
            customer_id
            starting_price
            reserve_price
            days
            min_qty
            max_qty
            start_auction_time
            stop_auction_time
            auction_status
            increment_opt
            increment_price
            auto_auction_opt
            featured_auction
            buy_it_now
            max_amount
            min_amount
            current_time_stamp
            continue_time
            limit_bids
            time_zone
            stop_auction_utc_time
            start_auction_utc_time
            today_time
            start_auction_time_stamp
            stop_auction_time_stamp
            new_auction_start
            customer_name
            max_bids
        }
        preorder {
            is_preorder
            pre_order_payment_type
            pre_order_deposit
            pre_order_notes
            pre_order_date
        }
        term_and_conditions
        custom_table_metadata {
            mainAttrCode
            mainAttrVal
            mainAttrLabel
        }
        shipping_policy
        return_policy
        small_image {
            url
        }
        stock_status
        url_key
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
        ... on ConfigurableProduct {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            configurable_options {
                attribute_code
                attribute_id
                uid
                label
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                values {
                    uid
                    default_label
                    label
                    store_label
                    use_default_value
                    value_index
                    swatch_data {
                        ... on ImageSwatchData {
                            thumbnail
                        }
                        value
                    }
                }
            }
            variants {
                attributes {
                    code
                    value_index
                }
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                product {
                    uid
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    media_gallery_entries {
                        uid
                        disabled
                        file
                        label
                        position
                    }
                    name
                    sku
                    stock_status
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                    price_range {
                        maximum_price {
                            final_price {
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
                            discount {
                                amount_off
                            }
                        }
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
                }
            }
        }
    }
`;
