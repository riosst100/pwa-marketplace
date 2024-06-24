import { gql } from '@apollo/client';

export const getStoreConfig = gql`
    query {
        storeConfig {
            header_logo_src
            base_url
            store_code
            base_media_url
            logo_width
            logo_height
            logo_alt
        }
    }
`;

export default {
    getStoreConfig,
};