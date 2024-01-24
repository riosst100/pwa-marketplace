import { gql } from '@apollo/client';

export const BECOME_SELLER = gql`
    mutation BecomeSeller(
        $seller_type: String
        $group_id: String!
        $url_key: String!
        $name: String!
        $company: String
        $company_registration_number: String
        $country_id: String
        $address_line_1: String!
        $address_line_2: String
        $city: String!
        $region: String
        $region_id: String
        $postcode: String!
        $contact_number: String!
    ) {
        becomeSeller(
            input: {
                seller_type: $seller_type
                group_id: $group_id
                url_key: $url_key
                name: $name
                company: $company
                company_registration_number: $company_registration_number,
                country_id: $country_id
                address_line_1: $address_line_1
                address_line_2: $address_line_2
                city: $city
                region: $region
                region_id: $region_id
                postcode: $postcode
                contact_number: $contact_number
            }
        ) {
            code
            message
        }
    }
`;

export default {
    becomeSellerMutation: BECOME_SELLER
};