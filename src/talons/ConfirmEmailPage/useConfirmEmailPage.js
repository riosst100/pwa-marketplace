
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './confirmEmailPage.gql';
import { useHistory } from 'react-router-dom';
import { useToasts } from '@magento/peregrine';

export const useConfirmEmailPage = (props = {}) => {
    const { formatMessage } = useIntl();

    const { id, key } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const history = useHistory();

    const [, { addToast }] = useToasts();

    const {
        confirmCustomerEmailMutation
    } = operations;
    
    const [confirmEmail, { called: called, data: data, error: error, loading: loading}] = useMutation(
        confirmCustomerEmailMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleConfirmEmail = useCallback(() => {
        confirmEmail({
            variables: {
                id,
                key
            }
        });
    }, [
        confirmEmail,
        id,
        key
    ]);

    const shouldShowLoadingIndicator = called && loading;
    const isSuccess = !loading && data && data.confirmCustomerEmail.success ? true : false;
    
    
    useEffect(() => {
        if (data && !loading) {
            if (data.confirmCustomerEmail.success) {
                addToast({
                    type: 'success',
                    message: formatMessage({
                        id: 'emailConfirmation.confirmEmailSuccess',
                        defaultMessage: data.confirmCustomerEmail.message
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
        handleConfirmEmail,
        shouldShowLoadingIndicator,
        isSuccess
    };
}