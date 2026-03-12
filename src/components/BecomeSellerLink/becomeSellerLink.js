import React, { useCallback } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './becomeSellerLink.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useBecomeSellerLink } from '@riosst100/pwa-marketplace/src/talons/BecomeSellerLink/useBecomeSellerLink';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { Shop } from 'iconsax-react';

import { useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '@magento/peregrine';

const storage = new BrowserPersistence();

const BecomeSellerLink = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const history = useHistory();

    const [{ isSignedIn }] = useUserContext();
    const [, { addToast }] = useToasts();

    const { isSeller } = useBecomeSellerLink(props);

    const websiteCountry =
        storage.getItem('website_code') &&
        storage.getItem('website_code') != "base"
            ? '/' + storage.getItem('website_code')
            : '';

    const sellerDashboardUrl = process.env.MAGENTO_BACKEND_URL
        ? process.env.MAGENTO_BACKEND_URL + websiteCountry
        : '';

    const handleBecomeSellerClick = useCallback(
        e => {
            e.preventDefault();

            if (!isSignedIn) {

                addToast({
                    type: 'error',
                    message: formatMessage({
                        id: 'becomeSeller.warningLogin',
                        defaultMessage: 'Please sign in first before becoming a seller.'
                    }),
                    timeout: 3000
                });

                history.push('/sign-in', {
                    from: '/become-seller'
                });

                return;
            }

            history.push(resourceUrl('/become-seller'));
        },
        [isSignedIn, addToast, history, formatMessage]
    );

    return isSeller ? (
        <div className={classes.root} data-cy="BecomeSellerLink-root">
            <Shop color="#f76b1c" size={14} variant="Outline" className="stroke-[#fff]" />

            <a href={sellerDashboardUrl + "/lofmarketplace/seller/login"}>
                {formatMessage({
                    id: 'sellerDashboard.title',
                    defaultMessage: 'Seller Dashboard'
                })}
            </a>
        </div>
    ) : (
        <div className={classes.root} data-cy="BecomeSellerLink-root">
            <Shop color="#f76b1c" size={14} variant="Outline" className="stroke-[#fff]" />

            <button
                onClick={handleBecomeSellerClick}
                className="text-base leading-[16px]"
            >
                {formatMessage({
                    id: 'becomeSellerPage.title',
                    defaultMessage: 'Become a Seller'
                })}
            </button>
        </div>
    );
};

export default BecomeSellerLink;

BecomeSellerLink.propTypes = {
    classes: shape({
        root: string
    })
};