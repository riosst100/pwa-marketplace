import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import DEFAULT_OPERATIONS from './socialLogin.gql'
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export const useSocialLogin = props => {
    const {
        jwtToken
    } = props;

    const [, { addToast }] = useToasts();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCartMutation,
        getCustomerQuery,
        mergeCartsMutation,
        getCartDetailsQuery,
        socialGoogleAuthenticateMutation
    } = operations;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();

    const [
        { isGettingDetails, getDetailsError },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [, { dispatch }] = useEventingContext();

    const [signIn, { error: signInError }] = useMutation(socialGoogleAuthenticateMutation, {
        fetchPolicy: 'no-cache'
    });

    const generateReCaptchaData = null;

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    useEffect(async () => {
        if (jwtToken) {
            setIsLoading(true);
            setIsSigningIn(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: {
                        jwt_token: jwtToken
                    }
                });

                const token = signInResponse.data.socialGoogleAuthenticate.token;
                await setToken(token);

                await getUserDetails({ fetchUserDetails });

                // Clear all cart/customer data from cache and redux.
                await apolloClient.clearCacheData(apolloClient, 'cart');
                await apolloClient.clearCacheData(apolloClient, 'customer');
                await removeCart();

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId
                    }
                });

                // Ensure old stores are updated with any new data.
                

                const { data } = await fetchUserDetails({
                    fetchPolicy: 'cache-only'
                });

                if (data.customer.is_seller) {
                    storage.setItem('is_seller', true);
                }

                dispatch({
                    type: 'USER_SIGN_IN',
                    payload: {
                        ...data.customer
                    }
                });

                getCartDetails({ fetchCartId, fetchCartDetails });

                addToast({
                    type: 'success',
                    message: formatMessage({
                        id: 'signIn.signInSuccessToast',
                        defaultMessage: "You have successfully signed in."
                    }),
                    timeout: 5000
                });

                setIsLoading(false);
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        }
    }, [
            jwtToken,
            cartId,
            generateReCaptchaData,
            signIn,
            setToken,
            apolloClient,
            removeCart,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            dispatch
        ]
    );

    const errors = useMemo(
        () =>
            new Map([
                ['getUserDetailsQuery', getDetailsError],
                ['socialGoogleAuthenticateMutation', signInError]
            ]),
        [getDetailsError, signInError]
    );

    return {
        errors,
        isLoading,
        // isBusy: isGettingDetails || isSigningIn || recaptchaLoading,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
