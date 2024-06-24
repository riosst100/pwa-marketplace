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

export const GET_SHOP_BY_DATA_QUERY = gql`
    query getShopByData($activeFilter: String, $categoryUrlKey: String!, $attributeCode: String, $filters: ProductAttributeFilterInput!) {
        shopByData(activeFilter: $activeFilter, categoryUrlKey: $categoryUrlKey, attributeCode: $attributeCode, filters: $filters) {
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
    getShopByDataQuery: GET_SHOP_BY_DATA_QUERY,
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getFilterInputsQuery: GET_FILTER_INPUTS,
};
