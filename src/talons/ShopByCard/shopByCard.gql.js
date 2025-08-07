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

export const GET_COLLECTIBLE_GAME_QUERY = gql`
    query getShopByCard($categoryUrlKey: String!, $productType: String, $filters: ProductAttributeFilterInput!) {
        shopByCard(categoryUrlKey: $categoryUrlKey, productType: $productType, filters: $filters) {
            release_type
            sets {
                set_name
                option_id
                set_abbreviation
                release_date
                release_year
                release_number
            }
        }
    }
`;

export const GET_SPORT_CARDS_SETS_QUERY = gql`
    query getSportCardsSets($categoryUrlKey: String!, $setType: String) {
        sportCardsSets(categoryUrlKey: $categoryUrlKey, setType: $setType) {
            group
            sets {
                set_name
                option_id
                release_year
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
    getCollectibleGameQuery: GET_COLLECTIBLE_GAME_QUERY,
    getSportCardsSetsQuery: GET_SPORT_CARDS_SETS_QUERY,
    getFilterInputsQuery: GET_FILTER_INPUTS
};
