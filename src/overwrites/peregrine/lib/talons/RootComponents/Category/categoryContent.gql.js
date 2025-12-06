import { gql } from '@apollo/client';

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query getProductFiltersByCategory(
        $filters: ProductAttributeFilterInput!
        $category_uid: String
    ) {
        products(
            filter: $filters
            category_uid: $category_uid
        ) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                    count
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
                default_top_filter {
                    attribute_code
                    label
                    value
                }
                url_path
                prefixes
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
            category_url_suffix
            store_code
            custommarketplace_plp_filters_virtualcategory
        }
    }
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForCategory {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export const GET_MASTER_ATTRIBUTES = gql`
    query GetMasterAttributes {
        masterAttributes {
            attribute_code
        }
    }
`;


export default {
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY,
    getCategoryAvailableSortMethodsQuery: GET_CATEGORY_AVAILABLE_SORT_METHODS,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA,
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getMasterAttributesQuery: GET_MASTER_ATTRIBUTES
};
