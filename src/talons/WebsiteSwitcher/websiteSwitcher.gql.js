import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            store_name
            store_group_name
            website_name
        }
    }
`;

export const GET_ROUTE_DATA = gql`
    query getRouteData($url: String!) {
        route(url: $url) {
            relative_url
        }
    }
`;

export const GET_AVAILABLE_WEBSITES_DATA = gql`
    query availableStoresByUserIp {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        availableStoresByUserIp {
            default_display_currency_code
            locale
            secure_base_media_url
            store_code
            store_group_code
            store_group_name
            store_name
            store_sort_order
            website_name
            website_code
        }
    }
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getRouteData: GET_ROUTE_DATA,
    getAvailableWebsitesData: GET_AVAILABLE_WEBSITES_DATA
};
