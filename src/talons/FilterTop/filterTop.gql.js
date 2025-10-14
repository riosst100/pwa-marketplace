import { gql } from '@apollo/client';

export const GET_CUSTOM_FILTERS = gql`
    query GetCustomFilters($search: String, $filterBy: String, $shopby: String, $category: String, $filters: ProductAttributeFilterInput) {
        customSubFilters(search: $search, filterBy: $filterBy, shopby: $shopby, category: $category, filters: $filters) {
            filter_id
            filters {
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
