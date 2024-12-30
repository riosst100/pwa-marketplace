import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
            category_url_suffix
        }
    }
`;

export const GET_SETS_DATA_QUERY = gql`
    query getSetsData($categoryUrlKey: String!, $activeTab: String, $filters: ProductAttributeFilterInput!, $shopby: String, $activeFilter: String) {
        getSetsData(categoryUrlKey: $categoryUrlKey, activeTab: $activeTab, filters: $filters, shopby: $shopby, activeFilter: $activeFilter) {
            attribute {
                attribute_code
                label
            }
            page_info {
                title
                hide_title
                filter_group
            }
            data {
                group
                sets {
                    set_name
                    option_id
                    release_year
                }
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
                url_key
                url_path
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

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getSetsDataQuery: GET_SETS_DATA_QUERY,
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getFilterInputsQuery: GET_FILTER_INPUTS,
};
