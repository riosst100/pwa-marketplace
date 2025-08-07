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
                    <span className={classes.nameLabel}>
                        <FormattedMessage
                            id={'global.sellerDashboardLoginAccountText'}
                            defaultMessage={'Seller Dashboard Login Account'}
                        />
                    </span>
                    <div className={classes.lineItemsContainer}>
                        <span className={classes.emailLabel}>
                            <FormattedMessage
                                id={'global.email'}
                                defaultMessage={'Email'}
                            />
                        </span>
                        <span className={classes.emailValue}>
                            {customer.email}
                        </span>
                        <span className={classes.passwordLabel}>
                            <FormattedMessage
                                id={'global.password'}
                                defaultMessage={'Password'}
                            />
                        </span>
                        <span className={classes.passwordValue}>
                            {passwordValue}
                        </span>
                    </div>
                    <div className={classes.editButtonContainer}>
                        <a href={process.env.MAGENTO_BACKEND_URL + "/lofmarketplace/seller/login"} className={classes.editInformationButton}>
                            <FormattedMessage
                                id={'global.sellerDashboardText'}
                                defaultMessage={'Seller Dashboard'}
                            />
                        </a>
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
