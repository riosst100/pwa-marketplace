import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        items {
            uid
            is_preorder
            pre_order_payment_type
            pre_order_deposit
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            seller {
                seller_name
                seller_url
                seller_id
            }
            product {
                uid
                name
                sku
                url_key
                release_date
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                stock_status
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                            code
                            value_index
                        }
                        # eslint-disable-next-line @graphql-eslint/require-id-when-available
                        product {
                            uid
                            stock_status
                            small_image {
                                url
                            }
                        }
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
                row_total {
                    value
                }
                total_item_discount {
                    value
                }
            }
            quantity
            errors {
                code
                message
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ConfigurableCartItem {
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                configurable_options {
                    id
                    configurable_product_option_uid
                    option_label
                    configurable_product_option_value_uid
                    value_label
                    value_id
                }
            }
        }
    }
`;
