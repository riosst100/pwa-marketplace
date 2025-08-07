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

export const GET_SPORT_CARDS_SETS_QUERY = gql`
    query getSportCardsSets($categoryUrlKey: String!, $shopby: String, $setType: String, $filters: ProductAttributeFilterInput!) {
        sportCardsSets(categoryUrlKey: $categoryUrlKey, shopby: $shopby, setType: $setType, filters: $filters) {
            group
            sets {
                set_name
                option_id
                release_year
                sc_league
                sc_brands
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
    getSportCardsSetsQuery: GET_SPORT_CARDS_SETS_QUERY,
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getFilterInputsQuery: GET_FILTER_INPUTS,
};
