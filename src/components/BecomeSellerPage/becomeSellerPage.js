import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useBecomeSellerPage } from '@riosst100/pwa-marketplace/src/talons/BecomeSellerPage/useBecomeSellerPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import BecomeSeller from '@riosst100/pwa-marketplace/src/components/BecomeSeller';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './becomeSellerPage.module.css';
import cn from 'classnames';

const BecomeSellerPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { becomeSellerProps } = useBecomeSellerPage(props);
    const { formatMessage } = useIntl();

    const { isSeller } = becomeSellerProps

    return !isSeller ? (
        <div className={classes.rootContainer}>
            <div className={cn(classes.leftContent, '!py-[60px]')}>
                <StoreTitle>
                    {formatMessage({
                        id: 'signInPage.title',
                        defaultMessage: 'Sign In'
                    })}
                </StoreTitle>
                <div className={cn(classes.leftContentContainer, '')}>
                    <div class="auth-left">
                        <img src="https://img.freepik.com/premium-vector/verified-seller-illustration-concept-white-background_701961-240.jpg" width="100%" />
                        <p style={{
                            "fontSize": "20px",
                            "fontWeight": 500
                        }}>Create a seller account and start selling your collectibles today.</p>
                    </div>
                </div>
            </div>
            <div className={classes.root}>
                <StoreTitle>
                    {formatMessage({
                        id: 'becomeSellerPage.title',
                        defaultMessage: 'Become a Seller'
                    })}
                </StoreTitle>
                <div className="lg_border-2 lg_border-solid lg_border-subtle lg_rounded-md !border !border-gray-100 !rounded-lg">
                    <BecomeSeller {...becomeSellerProps} />
                </div>
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
