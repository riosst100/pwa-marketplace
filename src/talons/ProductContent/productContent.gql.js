import { gql } from '@apollo/client';

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query getProductFiltersByCategory(
        $categoryIdFilter: FilterEqualTypeInput!
    ) {
        products(filter: { category_uid: $categoryIdFilter }) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
                position
            }
        }
    }
`;

export const GET_CATEGORY_CONTENT = gql`
    query getCategoryData($id: String!) {
        categories(filters: { category_uid: { in: [$id] } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                name
                description
                url_key
                url_path
                hide_filters
                allowed_filters {
                    code
                }
                custom_subcategory {
                    name
                    path
                }
                attributes_block {
                    label
                    code
                    items {
                      label
                      value
                    }
                }
                parent {
                    uid
                    name
                    position
                    url_path
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                }
                children {
                    uid
                    name
                    position
                    url_path
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                }
            }
        }
    }
`;

export const GET_CATEGORY_AVAILABLE_SORT_METHODS = gql`
    query getCategoryAvailableSortMethods(
        $categoryIdFilter: FilterEqualTypeInput!
    ) {
        products(filter: { category_uid: $categoryIdFilter }) {
            sort_fields {
                options {
                    label
                    value
                }
            }
        }
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForBreadcrumbs {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            custommarketplace_plp_filters_virtualcategory
        }
    }
`;

export const GET_PAYMENT_TYPES = gql`
    query getPaymentTypeOptions {
        getPaymentType {
            label
            value
        }
    }
`;


export default {
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY,
    getCategoryAvailableSortMethodsQuery: GET_CATEGORY_AVAILABLE_SORT_METHODS,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA,
    getPaymentTypesQuery: GET_PAYMENT_TYPES
};
