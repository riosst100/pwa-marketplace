import { useCallback, useMemo, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';

import DEFAULT_OPERATIONS from './becomeSeller.gql';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export const useBecomeSeller = props => {
    const { initialValues = {}, onSubmit, onCancel } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        becomeSellerMutation
    } = operations;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sellerType, setSellerType] = useState('individual');

    const [, { dispatch }] = useEventingContext();

    // For create account and sign in mutations, we don't want to cache any
    // personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    const [becomeSeller, { error: becomeSellerError }] = useMutation(
        becomeSellerMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const {
        generateReCaptchaData,
        recaptchaLoading,
        recaptchaWidgetProps
    } = useGoogleReCaptcha({
        currentForm: 'BECOME_SELLER',
        formAction: 'becomeSeller'
    });

    const handleChange =  useCallback(
        async formValues => {
            if (formValues.values.seller) {
                setSellerType(formValues.values.seller.seller_type)
            }
        }
    );

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {

                // Get reCaptchaV3 Data for becomeSeller mutation
                const recaptchaDataForBecomeSeller = await generateReCaptchaData();

                // Create the account and then sign in.
                const result = await becomeSeller({
                    variables: {
                        seller_type: formValues.seller.seller_type,
                        group_id: '',
                        url_key: formValues.seller.store_url,
                        name: formValues.seller.seller_profile_name,
                        company: formValues.seller.company_name,
                        company_registration_number: formValues.seller.company_registration_number,
                        country_id: formValues.seller.country_id,
                        address_line_1: formValues.seller.address_line_1,
                        address_line_2: formValues.seller.address_line_2,
                        city: formValues.seller.city,
                        region: formValues.seller.region,
                        region_id: formValues.seller.region_id,
                        postcode: formValues.seller.postcode,
                        contact_number: formValues.seller.contact_number
                    },
                    ...recaptchaDataForBecomeSeller
                });

                if (result.data.becomeSeller.code) {
                    storage.setItem('is_seller', true);

                    globalThis.location.assign('/seller-account');
                }

                dispatch({
                    type: 'BECOME_SELLER',
                    payload: {
                        group_id: 'basic',
                        url_key: formValues.seller.store_url
                    }
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },

        [
            generateReCaptchaData,
            becomeSeller,
            onSubmit,
            dispatch
        ]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { sellerProfileName, companyName, ...rest } = initialValues;

        return {
            seller: { profile_name: sellerProfileName, company: companyName, country: "AF" },
            ...rest
        };
    }, [initialValues]);

    const errors = useMemo(
        () =>
            new Map([
                ['becomeSellerQuery', becomeSellerError]
            ]),
        [becomeSellerError]
    );

    const isSeller = storage.getItem('is_seller') || false;

    return {
        isSeller,
        errors,
        handleSubmit,
        sellerType,
        handleChange,
        initialValues: sanitizedInitialValues,
        isDisabled: isSubmitting || recaptchaLoading,
        recaptchaWidgetProps
    };
};