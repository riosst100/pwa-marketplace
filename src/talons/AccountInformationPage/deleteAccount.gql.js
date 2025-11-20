import { gql } from '@apollo/client';

export const DELETE_ACCOUNT = gql`
    mutation DeleteAccount {
        deleteCustomerAccount {
            success
            message
        }
    }
`;

export const SIGN_OUT = gql`
    mutation SignOutFromMenu {
        revokeCustomerToken {
            result
        }
    }
`;

export default {
    deleteAccountMutation: DELETE_ACCOUNT,
    signOutMutation: SIGN_OUT
};