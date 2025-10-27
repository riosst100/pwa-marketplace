import React, { useEffect, useCallback } from 'react';
import { shape, string, bool, func } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

// Keep styles minimal; reuse global utilities if needed
const defaultClasses = {};

/**
 * Xendit payment component (minimal flow)
 * - Assumes method is set via Radio change.
 * - Syncs billing address and advances on submit.
 * - Extend to add Xendit tokenization/redirect before calling onPaymentSuccess.
 */
const Xendit = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { shouldSubmit, onPaymentSuccess, resetShouldSubmit } = props;

    useEffect(() => {
        if (shouldSubmit) {
            onPaymentSuccess && onPaymentSuccess();
        }
    }, [shouldSubmit, onPaymentSuccess]);

    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit && resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(() => {
        /* Hook: start Xendit tokenization here if required by your backend */
    }, []);

    return (
        <div className={classes.root}>
            <BillingAddress
                shouldSubmit={shouldSubmit}
                resetShouldSubmit={resetShouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

Xendit.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default Xendit;
