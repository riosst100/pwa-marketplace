import { gql } from '@apollo/client';

export const RESEND_EMAIL_CONFIRMATION = gql`
    mutation ResendEmailConfirmation(
        $email: String!
    ) {
        resendCustomerConfirmation(
            email: $email
        ) {
            success
            message
        }
    }
`;

export const CONFIRM_EMAIL = gql`
    mutation ConfirmEmail(
        $id: String!
        $key: String!
    ) {
        confirmCustomerEmail(
            input: {
                id: $id
                key: $key
            }
        ) {
            success
            message
        }
    }
`;

export default {
    resendEmailConfirmationMutation: RESEND_EMAIL_CONFIRMATION,
    confirmCustomerEmailMutation: CONFIRM_EMAIL
};