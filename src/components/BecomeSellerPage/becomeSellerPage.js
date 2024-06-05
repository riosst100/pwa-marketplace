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

    const { isSeller } = becomeSellerProps

    return !isSeller ? (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'becomeSellerPage.title',
                    defaultMessage: 'Become a Seller'
                })}
            </StoreTitle>
            <div className="lg_border-2 lg_border-solid lg_border-subtle lg_pb-md lg_rounded-md !border !border-gray-100 !rounded-lg">
                <BecomeSeller {...becomeSellerProps} />
            </div>
        </div>
    ) : ''
}

export default BecomeSellerPage;

BecomeSellerPage.defaultProps = {
    signedInRedirectUrl: '/become-seller',
    signInPageUrl: '/sign-in'
};

BecomeSellerPage.propTypes = {
    classes: shape({
        root: string
    }),
    signedInRedirectUrl: string
};
