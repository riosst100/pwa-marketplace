import React, { useCallback } from 'react';
import { shape, string, bool, func } from 'prop-types';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/client';

import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { useStyle } from '@magento/venia-ui/lib/classify';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';
import defaultClasses from './paymentMethods.module.css';
import payments from './paymentMethodCollection';
import {
    GET_SHIPPING_ADDRESS,
    SET_BILLING_ADDRESS
} from '@riosst100/pwa-marketplace/src/talons/Xendit/xendit';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        onPaymentError,
        onPaymentSuccess,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaymentMethods({});

    const {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        handlePaymentMethodSelection,
        initialSelectedMethod,
        isLoading
    } = talonProps;

    const [{ cartId }] = useCartContext();

    const { data: shippingData } = useQuery(GET_SHIPPING_ADDRESS, {
        skip: !cartId,
        variables: { cartId }
    });

    const [setBillingAddress] = useMutation(SET_BILLING_ADDRESS);

    const getRegionValue = region => {
        if (!region) return '';
        return region.region_id || region.label || region.code || '';
    };

    const handleChangeAndSetBilling = useCallback(
        async event => {
            // First, run canonical selection logic (updates selected payment on cart)
            handlePaymentMethodSelection(event);

            // Then, proactively set billing address using the selected shipping address
            try {
                const shippingAddresses =
                    shippingData?.cart?.shippingAddresses || [];
                const addr = shippingAddresses[0];
                if (!addr || !cartId) return;

                const street1 = Array.isArray(addr.street) ? addr.street[0] || '' : '';
                const street2 = Array.isArray(addr.street) ? addr.street[1] || '' : '';
                await setBillingAddress({
                    variables: {
                        cartId,
                        firstName: addr.firstName || '',
                        lastName: addr.lastName || '',
                        street1,
                        street2,
                        city: addr.city || '',
                        region: getRegionValue(addr.region),
                        postcode: addr.postcode || '',
                        country: addr.country?.code || '',
                        phoneNumber: addr.phoneNumber || ''
                    }
                });
            } catch (e) {
                // Non-blocking; payment selection should still work even if billing sync fails
                // eslint-disable-next-line no-console
                console.warn('Gagal menyetel billing address saat memilih metode pembayaran:', e);
            }
        },
        [cartId, handlePaymentMethodSelection, setBillingAddress, shippingData]
    );

    if (isLoading) {
        return null;
    }

    // Warn if Magento exposes payment methods that don't have a mapped UI component.
    const knownCodes = Object.keys(payments);
    const unknownMethods = availablePaymentMethods.filter(
        ({ code }) => !knownCodes.includes(code)
    );
    if (unknownMethods.length) {
        // eslint-disable-next-line no-console
        console.warn(
            'Checkout: Ditemukan metode pembayaran yang belum dipetakan:',
            unknownMethods.map(m => m.code),
            '\nPastikan metode tersebut terdaftar melalui target build Venia "checkoutPagePaymentTypes" atau ditambahkan ke paymentMethodCollection.'
        );
    }

    // Title fallback map to ensure labels are always visible.
    const TITLE_FALLBACK = {
        braintree: 'Credit/Debit Card',
        paypal_express: 'PayPal Express Checkout',
        paypal_express_bml: 'PayPal Credit',
        checkmo: 'Check / Money Order',
        xendit: 'Xendit',
        cc: 'Credit Card',
        free: 'Free'
    };

    const radios = availablePaymentMethods
        .map(({ code, title }) => {
            // If we don't have an implementation for a method type, ignore it.
            if (!Object.keys(payments).includes(code)) {
                return;
            }

            const id = `paymentMethod--${code}`;
            const isSelected = currentSelectedPaymentMethod === code;
            const displayTitle = title || TITLE_FALLBACK[code] || code;
            const PaymentMethodComponent = payments[code];
            const renderedComponent = isSelected ? (
                <PaymentMethodComponent
                    onPaymentSuccess={onPaymentSuccess}
                    onPaymentError={onPaymentError}
                    resetShouldSubmit={resetShouldSubmit}
                    shouldSubmit={shouldSubmit}
                    currentSelectedPaymentMethod={currentSelectedPaymentMethod}
                />
            ) : null;

            return (
                <div key={code} className={classes.payment_method}>
                    <Radio
                        id={id}
                        label={displayTitle}
                        value={code}
                        classes={{
                            label: classes.radio_label
                        }}
                        checked={isSelected}
                        onChange={handleChangeAndSetBilling}
                    />
                    {renderedComponent}
                </div>
            );
        })
        .filter(paymentMethod => !!paymentMethod);

    const noPaymentMethodMessage = !radios.length ? (
        <div className={classes.payment_errors}>
            <span>
                {formatMessage({
                    id: 'checkoutPage.paymentLoadingError',
                    defaultMessage: 'There was an error loading payments.'
                })}
            </span>
            <span>
                {formatMessage({
                    id: 'checkoutPage.refreshOrTryAgainLater',
                    defaultMessage: 'Please refresh or try again later.'
                })}
            </span>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <h5 className={classes.cardTitle}>
                {formatMessage({
                    id: 'checkoutPage.paymentInformation',
                    defaultMessage: 'Payment Method'
                })}
            </h5>
            <RadioGroup
                classes={{ root: classes.radio_group }}
                field="selectedPaymentMethod"
                initialValue={initialSelectedMethod}
            >
                {radios}
            </RadioGroup>
            {noPaymentMethodMessage}
        </div>
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};
