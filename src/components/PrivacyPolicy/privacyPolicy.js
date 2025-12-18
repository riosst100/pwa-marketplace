import React from 'react';
import CMSPage from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/RootComponents/CMS/cms';
import classes from './privacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className={classes.root}>
            <CMSPage identifier="privacy-policy" />
        </div>
    );
}

export default PrivacyPolicy;