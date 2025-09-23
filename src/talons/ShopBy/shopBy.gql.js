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
    query getShopByData($search: String, $activeFilter: String, $categoryUrlKey: String!, $attributeCode: String, $filters: ProductAttributeFilterInput!) {
        shopByData(search: $search, activeFilter: $activeFilter, categoryUrlKey: $categoryUrlKey, attributeCode: $attributeCode, filters: $filters) {
            page_info {
                title
                filter_group
            }
            data {
                label
                count
                attribute_code
                options {
                    products_count
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

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query getProductMainFiltersByCategory(
        $filters: ProductAttributeFilterInput!
    ) {
        products(filter: $filters) {
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

export const GET_MASTER_ATTRIBUTES = gql`
    query GetMasterAttributes {
        masterAttributes {
            attribute_code
        }
    }
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getShopByDataQuery: GET_SHOP_BY_DATA_QUERY,
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY,
    getMasterAttributesQuery: GET_MASTER_ATTRIBUTES
};
