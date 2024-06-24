import React from 'react';
import { useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { useSellerCountry } from '@riosst100/pwa-marketplace/src/talons/SellerCountry/useSellerCountry';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import Select from '@magento/venia-ui/lib/components/Select';
import defaultClasses from './sellerCountry.module.css';
import { GET_SELLER_COUNTRIES_QUERY } from './sellerCountry.gql';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const SellerCountry = props => {
    const talonProps = useSellerCountry({
        queries: {
            getSellerCountriesQuery: GET_SELLER_COUNTRIES_QUERY
        }
    });
    const { countries, loading } = talonProps;
    const {
        classes: propClasses,
        field,
        label,
        translationId,
        ...inputProps
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);
    const websiteCode = storage.getItem('website_code') || null;
    const currentWebsiteCountry = websiteCode && websiteCode != "base" ? websiteCode.toUpperCase() : DEFAULT_COUNTRY_CODE;
    const selectProps = {
        classes,
        disabled: loading,
        field,
        items: countries,
        initialValue: currentWebsiteCountry,
        ...inputProps
    };

    return (
        <Field
            id={classes.root}
            label={formatMessage({ id: translationId, defaultMessage: label })}
        // classes={{ root: classes.root }}
        >
            <Select {...selectProps} id={classes.root} />
        </Field>
    );
};

export default SellerCountry;

SellerCountry.defaultProps = {
    field: 'country',
    label: 'Country',
    translationId: 'country.label'
};

SellerCountry.propTypes = {
    classes: shape({
        root: string
    }),
    field: string,
    label: string,
    translationId: string,
    validate: func,
    initialValue: string
};
