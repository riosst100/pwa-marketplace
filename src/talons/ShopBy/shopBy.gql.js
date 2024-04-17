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
    query getShopByData($categoryUrlKey: String!, $attributeCode: String) {
        shopByData(categoryUrlKey: $categoryUrlKey, attributeCode: $attributeCode) {
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

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getShopByDataQuery: GET_SHOP_BY_DATA_QUERY,
    getCategoryContentQuery: GET_CATEGORY_CONTENT
};
