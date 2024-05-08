import { gql } from '@apollo/client';

export const GET_CUSTOM_FILTERS = gql`
    query GetCustomFilters($categoryUrlKey: String!, $filters: ProductAttributeFilterInput!) {
        customSubFilters(categoryUrlKey: $categoryUrlKey, filters: $filters) {
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

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForBreadcrumbs {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export default {
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getCustomFilters: GET_CUSTOM_FILTERS,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
