import React from 'react';
import CMSPage from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/RootComponents/CMS/cms';
import classes from './aboutUs.css';

const AboutUs = () => {
    return (
        <div className={classes.root}>
            <CMSPage identifier="about-us" />
        </div>
    );
}

export default AboutUs;