import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useSellerAccountPage } from '@riosst100/pwa-marketplace/src/talons/SellerAccountPage/useSellerAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
// import SellerAccount from '@riosst100/pwa-marketplace/src/components/SellerAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './sellerAccountPage.module.css';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import AccountInformationPageOperations from '@magento/venia-ui/lib/components/AccountInformationPage/accountInformationPage.gql.js';
import Button from '@magento/venia-ui/lib/components/Button';

const SellerAccountPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const sellerAccountProps = useSellerAccountPage({
        ...AccountInformationPageOperations
    });
    const {
        handleCancel,
        formErrors,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode,
        recaptchaWidgetProps
    } = sellerAccountProps;
    const { formatMessage } = useIntl();

    let sellerAccountDetails = null;
    let sellerLoginAccount = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;
        const customerName = `${customer.firstname} ${customer.lastname}`;
        const passwordValue = 'Same as current';

        sellerLoginAccount = (
            <Fragment>
                <div className={classes.accountDetails}>
                    <div className={classes.container}>
                    <div className={classes.success}>
                        {/* <h2 className={classes.title}>Seller Registration Successful!</h2> */}
                        <p className={classes.message}>
                        Congratulations! Your registration as a seller was successful.  
                        Please log in to the <strong>Seller Dashboard</strong> with your account to complete the verification process and start managing your listings.
                        </p>
                    </div>

                    {/* <div className={classes.card}> */}
                        <div className={classes.actions}>
                        <a href={process.env.MAGENTO_BACKEND_URL + "/lofmarketplace/seller/login"} className={classes.btn} role="button">
                            <FormattedMessage
                                id={'global.sellerDashboardText'}
                                defaultMessage={'Go to Seller Dashboard'}
                            /> →
                        </a>
                        </div>
                    {/* </div> */}
                    </div>
                </div>
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'sellerAccountPage.title',
                    defaultMessage: 'Seller Account'
                })}
            </StoreTitle>
            {sellerLoginAccount}
        </div>
    )
}

export default SellerAccountPage;

SellerAccountPage.defaultProps = {
    signedInRedirectUrl: '/seller-account',
    signInPageUrl: '/sign-in'
};

SellerAccountPage.propTypes = {
    classes: shape({
        root: string
    }),
    signedInRedirectUrl: string
};
