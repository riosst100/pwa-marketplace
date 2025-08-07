import gql from 'graphql-tag';

export const GET_WEBSITE_BY_IP = gql`
    query getWebsiteByUserIp (
        $ip_address: String
    ) {
        getWebsiteByUserIp(ip_address: $ip_address) {
            store_code
            website_code
            website_name
            is_suggested
        }
    }
`;