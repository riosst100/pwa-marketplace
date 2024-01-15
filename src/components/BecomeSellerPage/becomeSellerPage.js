import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useBecomeSellerPage } from '@riosst100/pwa-marketplace/src/talons/BecomeSellerPage/useBecomeSellerPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import BecomeSeller from '@riosst100/pwa-marketplace/src/components/BecomeSeller';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './becomeSellerPage.module.css';

const BecomeSellerPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { becomeSellerProps } = useBecomeSellerPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'becomeSellerPage.title',
                    defaultMessage: 'Become a Seller'
                })}
            </StoreTitle>
            <h1 className={classes.header}>
                <FormattedMessage
                    id="becomeSellerPage.header"
                    defaultMessage="Become a Seller"
                />
            </h1>
            <div className={classes.contentContainer}>
                <BecomeSeller {...becomeSellerProps} />
            </div>
        </div>
    );
}

export default BecomeSellerPage;

BecomeSellerPage.defaultProps = {
    signedInRedirectUrl: '/become-seller',
    signInPageUrl: 'https://seller-local.tcgcollective.co'
};

BecomeSellerPage.propTypes = {
    classes: shape({
        root: string
    }),
    signedInRedirectUrl: string,
    signInPageUrl: string
};
