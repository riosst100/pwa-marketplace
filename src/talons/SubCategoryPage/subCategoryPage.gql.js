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

export const GET_CATEGORY_CONTENT = gql`
    query getCategoryData($id: String!) {
        categories(filters: { category_uid: { in: [$id] } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                name
                url_key
                url_path
                parent {
                    uid
                    name
                }
                children {
                    uid
                    name
                    url_path
                }
            }
        }
    }
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getCategoryContentQuery: GET_CATEGORY_CONTENT
};
