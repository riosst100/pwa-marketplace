import { gql } from '@apollo/client';

export const CONFIRM_EMAIL = gql`
    mutation ConfirmEmail(
        $id: Int!
        $key: String!
    ) {
        confirmCustomerEmail(
            id: $id
            key: $key
        ) {
            success
            message
        }
    }
`;

export default {
    confirmCustomerEmailMutation: CONFIRM_EMAIL
};