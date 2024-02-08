import { gql } from '@apollo/client';

export const GET_SELLER_COUNTRIES_QUERY = gql`
    query GetSellerCountries {
        sellerCountries {
            id
            full_name_english
            two_letter_abbreviation
        }
    }
`;
