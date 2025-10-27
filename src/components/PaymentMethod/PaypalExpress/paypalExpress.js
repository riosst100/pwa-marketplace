import React from 'react';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import {shape, string, bool, func} from 'prop-types';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import {usePaypalExpress} from '@riosst100/pwa-marketplace/src/talons/PaymentMethod/PaypalExpress/usePaypalExpress';
import defaultClasses from './paypalExpress.css';
import {FormattedMessage} from 'react-intl';

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PaypalExpress = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError,
        currentSelectedPaymentMethod
    } = props;

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = usePaypalExpress({
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError,
        currentSelectedPaymentMethod
    });

    return (
        <div className={classes.root}>
            <p className={classes.note}>
                <FormattedMessage
                    id={'multiSafepayPayment.note'}
                    defaultMessage={'Note: You will be redirected to the payment page.'}
                />
            </p>
            <BillingAddress
                shouldSubmit={props.shouldSubmit}
                resetShouldSubmit={resetShouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

PaypalExpress.propTypes = {
    classes: shape({root: string}),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired,
    currentSelectedPaymentMethod: string
};

export default PaypalExpress;