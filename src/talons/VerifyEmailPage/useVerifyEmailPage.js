
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './verifyEmailPage.gql';
import { useHistory } from 'react-router-dom';
import { useToasts } from '@magento/peregrine';

export const useVerifyEmailPage = (props = {}) => {
    const { formatMessage } = useIntl();

    const { email } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const history = useHistory();

    const [, { addToast }] = useToasts();

    const {
        resendEmailConfirmationMutation
    } = operations;
    
    const [resendEmailConfirmation, { called: called, data: data, error: error, loading: loading}] = useMutation(
        resendEmailConfirmationMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleResendEmail = useCallback(() => {
        resendEmailConfirmation({
            variables: {
                email
            }
        });
    }, [
        resendEmailConfirmation,
        email
    ]);

    const shouldShowLoadingIndicator = called && loading;
    
    useEffect(() => {
        if (data && !loading) {
            if (data.resendCustomerConfirmation.success) {
                addToast({
                    type: 'success',
                    message: formatMessage({
                        id: 'emailConfirmation.resendConfirmEmailSuccess',
                        defaultMessage: data.resendCustomerConfirmation.message
                    }),
                    timeout: 10000
                });

                // history.go(0)
            }
        }
    }, [
        data,
        loading,
        addToast
    ]);

    return {
        loading,
        error,
        data,
        handleResendEmail,
        shouldShowLoadingIndicator
    };
}