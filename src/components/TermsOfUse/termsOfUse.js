import React from 'react';
import CMSPage from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/RootComponents/CMS/cms';
import classes from './termsOfUse.css';

const TermsOfUse = () => {
    return (
        <div className={classes.root}>
            <CMSPage identifier="terms-of-use" />
        </div>
    );
}

export default TermsOfUse;