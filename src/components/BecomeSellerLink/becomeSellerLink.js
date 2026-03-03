import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './becomeSellerLink.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useBecomeSellerLink } from '@riosst100/pwa-marketplace/src/talons/BecomeSellerLink/useBecomeSellerLink';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import {Shop} from 'iconsax-react';

const storage = new BrowserPersistence();

const BecomeSellerLink = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const {
        isSeller
    } = useBecomeSellerLink(props);

    const websiteCountry = storage.getItem('website_code') && storage.getItem('website_code') != "base" ? '/' + storage.getItem('website_code') : '';
    const sellerDashboardUrl = process.env.MAGENTO_BACKEND_URL ? process.env.MAGENTO_BACKEND_URL + websiteCountry : '';

    return isSeller ? (
        <div className={classes.root} data-cy="BecomeSellerLink-root">
            <Shop color="#f76b1c" size={14} variant="Outline" className='stroke-[#fff]' />
            <a href={sellerDashboardUrl + "/lofmarketplace/seller/login"}>
                {formatMessage({
                    id: 'sellerDashboard.title',
                    defaultMessage: 'Seller Dashboard'
                })}
            </a>
        </div>
    ) : (
        <div className={classes.root} data-cy="BecomeSellerLink-root">
            <Shop color="#f76b1c" size={14} variant="Outline" className='stroke-[#fff]' />
            <Link
                to={resourceUrl('/become-seller')}
                className='text-base leading-[16px]'
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
