
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './deleteAccount.gql';
import { useHistory } from 'react-router-dom';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useToasts } from '@magento/peregrine';

export const useDeleteAccount = (props = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { formatMessage } = useIntl();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { signOutMutation } = operations;

    const history = useHistory();

    const [isSigningOut, setIsSigningOut] = useState(false);
    const [{ currentUser, isSignedIn }, { signOut }] = useUserContext();
    const [revokeToken] = useMutation(signOutMutation);
    
    const [, { dispatch }] = useEventingContext();
    const [, { addToast }] = useToasts();

    const {
        deleteAccountMutation
    } = operations;

    const [deleteAccount, { data: deleteAccountData, error: deleteAccountError, loading: deleteAccountLoading}] = useMutation(
        deleteAccountMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleDeleteAccount = useCallback(() => {
        deleteAccount({});
    }, [
        setLoading,
        deleteAccount,
        deleteAccountError,
        deleteAccountData
    ]);

    const handleSignOut = useCallback(async () => {
        setIsSigningOut(true);

        dispatch({
            type: 'USER_SIGN_OUT',
            payload: currentUser
        });

        // Delete cart/user data from the redux stor`e.
        await signOut({ revokeToken });

    }, [history, revokeToken, signOut, dispatch, currentUser]);

    useEffect(() => {
        if (deleteAccountLoading) {
            setLoading(true);
        }

        if (deleteAccountData && !deleteAccountLoading) {
            if (deleteAccountData.deleteCustomerAccount.success) {
                addToast({
                    type: 'info',
                    message: formatMessage({
                        id: 'deleteAccount.deleteAccountSuccess',
                        defaultMessage: 'Your account is deleted successfully.'
                    }),
                    timeout: 10000
                });

                handleSignOut();
            }

            setLoading(false);
        }
    }, [
        deleteAccountData,
        deleteAccountLoading,
        handleSignOut,
        addToast
    ]);

    return {
        loading,
        error,
        success,
        handleDeleteAccount
    };
}