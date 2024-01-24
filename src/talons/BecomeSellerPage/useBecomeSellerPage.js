import { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const validBecomeSellerParams = ['sellerUrl', 'companyName', 'sellerProfileName'];

const storage = new BrowserPersistence();

const getBecomeSellerInitialValues = search => {
    const params = new URLSearchParams(search);

    return validBecomeSellerParams.reduce(
        (values, param) => ({ ...values, [param]: params.get(param) }),
        {}
    );
};

/**
 * @typedef {function} useBecomeSellerPage
 *
 * @param {String} props.signedInRedirectUrl - Url to push when user is signed in
 * @param {String} props.signInPageUrl - Sign In Page url
 *
 * @returns {{
 *   becomeSellerProps: object
 * }}
 */
export const useBecomeSellerPage = props => {
    const { signedInRedirectUrl, signInPageUrl } = props;
    const history = useHistory();
    const { search } = useLocation();

    const isSeller = storage.getItem('is_seller') || false;
    useEffect(() => {
        if (isSeller) {
            history.push('/')
        }
    }, [isSeller, history])

    // Keep location state in memory when pushing history and redirect to
    // the `from` url instead when creating an account
    const historyState = useMemo(() => {
        return history && history.location.state ? history.location.state : {};
    }, [history]);

    const handleOnCancel = useCallback(() => {
        if (signInPageUrl) {
            history.push(signInPageUrl, historyState);
        }
    }, [history, historyState, signInPageUrl]);

    const initialValues = useMemo(() => getBecomeSellerInitialValues(search), [
        search
    ]);

    const becomeSellerProps = {
        initialValues,
        isCancelButtonHidden: false,
        onCancel: handleOnCancel,
        isSeller: isSeller
    };

    return {
        becomeSellerProps
    };
};
