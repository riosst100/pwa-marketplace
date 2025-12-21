import { gql } from '@apollo/client';

export const GET_AGE_VERIFICATION_CONFIG_QUERY = gql`
    query GetAgeVerificationConfig(
        $attributeCode: String
        $attributeOption: String
    ) {
        getAgeVerificationConfig(
            attribute_code: $attributeCode
            attribute_option: $attributeOption
        ) {
            status
            minimum_age
        }
    }
`;

export const GET_CATALOG_CONFIG_DATA_QUERY = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            marketplace_menu_topfilters_attributes
        }
    }
`;

export default {
    getAgeVerificationConfigQuery: GET_AGE_VERIFICATION_CONFIG_QUERY,
    getMenuTopFiltersAttributesConfigDataQuery: GET_CATALOG_CONFIG_DATA_QUERY
};