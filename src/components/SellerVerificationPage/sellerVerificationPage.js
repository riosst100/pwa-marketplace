import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useBecomeSellerPage } from '@riosst100/pwa-marketplace/src/talons/BecomeSellerPage/useBecomeSellerPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import BecomeSeller from '@riosst100/pwa-marketplace/src/components/BecomeSeller';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './sellerVerificationPage.module.css';

const BecomeSellerPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { sellerVerificationProps } = useBecomeSellerPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'sellerVerificationPage.title',
                    defaultMessage: 'Become a Seller'
                })}
            </StoreTitle>
            <div className={classes.contentContainer}>
                <BecomeSeller {...sellerVerificationProps} />
            </div>
        </div>
    );
}

export default BecomeSellerPage;

BecomeSellerPage.defaultProps = {
    signedInRedirectUrl: '/seller-verification',
    signInPageUrl: '/become-seller'
};

BecomeSellerPage.propTypes = {
    classes: shape({
        root: string
    }),
    signedInRedirectUrl: string
};
