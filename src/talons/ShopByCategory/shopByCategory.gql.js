import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForBreadcrumbs {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export const GET_CATEGORY_LIST = gql`
    query getCategoryData($id: String!) {
        categories(filters: { category_uid: { eq: $id } }) {
            items {
                uid
                name
                url_path
                parent {
                    uid
                    name
                    url_path
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
    getStoreConfigQuery: GET_STORE_CONFIG_DATA,
    getCategoryQuery: GET_CATEGORY_LIST
};
