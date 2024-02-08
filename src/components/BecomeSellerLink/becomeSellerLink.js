import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './becomeSellerLink.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useBecomeSellerLink } from '@riosst100/pwa-marketplace/src/talons/BecomeSellerLink/useBecomeSellerLink';

const BecomeSellerLink = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const {
        isSeller
    } = useBecomeSellerLink(props);

    return isSeller ? (
        <div className={classes.root} data-cy="BecomeSellerLink-root">
            <a href={process.env.MAGENTO_BACKEND_URL + "/lofmarketplace/seller/login"}>
                {formatMessage({
                    id: 'sellerDashboard.title',
                    defaultMessage: 'Seller Dashboard'
                })}
            </a>
        </div>
    ) : (
        <div className={classes.root} data-cy="BecomeSellerLink-root">
            <Link
                to={resourceUrl('/become-seller')}
            >{formatMessage({
                id: 'becomeSellerPage.title',
                defaultMessage: 'Become a Seller'
            })}</Link>
        </div>
    );
};

export default BecomeSellerLink;

BecomeSellerLink.propTypes = {
    classes: shape({
        root: string
    })
};
