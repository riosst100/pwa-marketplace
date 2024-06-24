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
    query getShopByBrandsData($activeFilter: String, $categoryUrlKey: String!, $attributeCode: String, $filters: ProductAttributeFilterInput!) {
        shopByBrands(activeFilter: $activeFilter, categoryUrlKey: $categoryUrlKey, attributeCode: $attributeCode, filters: $filters) {
            filters {
                name
                value
                subfilter {
                    name
                    value
                }
            }
            options {
                name
                value
                attribute_code
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
    getShopByBrandsDataQuery: GET_SHOP_BY_DATA_QUERY,
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getFilterInputsQuery: GET_FILTER_INPUTS,
};
