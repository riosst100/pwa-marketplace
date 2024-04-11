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
    query getCollectibleGameSets($categoryUrlKey: String!, $productType: String) {
        collectibleGameSets(categoryUrlKey: $categoryUrlKey, productType: $productType) {
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

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getCollectibleGameQuery: GET_COLLECTIBLE_GAME_QUERY
};
