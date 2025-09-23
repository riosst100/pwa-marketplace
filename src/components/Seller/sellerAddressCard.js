import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/AddressBookPage/addressCard.module.css';

const SellerAddressCard = ({ address }) => {
    const {
        address_line_1,
        address_line_2,
        city,
        country,
        postcode,
        region
    } = address;

    const classes = useStyle(defaultClasses, null);

    // const nameString = [firstname, middlename, lastname]
    //     .filter(name => !!name)
    //     .join(' ');
    
    let additionalAddressString = `${city || ''}`;

    if (region || postcode) {
        additionalAddressString += `, ${region || ''} ${postcode || ''}`;
    }

    return (
        <div
            className={classes.contentContainer}
            data-cy="addressCard-contentContainer"
        >
            <span className={classes.streetRow}>
                {address_line_1 || ''}
            </span>
            <span className={classes.streetRow}>
                {address_line_2 || ''}
            </span>
            <span className={classes.additionalAddress}>
                {additionalAddressString || ''}
            </span>
            <span className={classes.country}>
                {country || ''}
            </span>
        </div>
    );
};

export default SellerAddressCard;