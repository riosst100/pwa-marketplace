import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;

export const GET_COLLECTIBLE_GAME_QUERY = gql`
    query getCollectibleGameSets($categoryUrlKey: String!) {
        collectibleGameSets(categoryUrlKey: $categoryUrlKey) {
            card_set
            card_game
            card_set_abbreviation
            card_release_year
        }
    }
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getCollectibleGameQuery: GET_COLLECTIBLE_GAME_QUERY
};
