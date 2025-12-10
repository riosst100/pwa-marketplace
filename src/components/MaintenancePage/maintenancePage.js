import React, { Fragment } from 'react';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './maintenancePage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const MaintenancePage = props => {

    const classes = useStyle(defaultClasses);

    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>We'll Be Back Soon</title>
            </head>
            <body className={classes.body}>
                <div className={classes.container}>
                    <img src="https://seller.tcgcollective.co/media/logo/default/FullLogo_Transparent_NoBuffer_14_.png" alt="Logo" className={classes.logo} />
                    <br />
                    <h1 className={classes.h1}>We're Temporarily Offline</h1>
                    <img src="https://seller.tcgcollective.co/media/maintenance.webp" alt="Logo" className={classes.logo} />
                    <p className={classes.p}>
                        Our website is currently undergoing scheduled maintenance. <br/>
                        We should be back shortly. Thank you for your patience.
                    </p>
                    <div className={classes.footer}>
                        &copy; <span id="year">{new Date().getFullYear()}</span> TCG Collective. All rights reserved.
                         {/* | <a href="mailto:support@yourdomain.com">Contact Support</a> */}
                    </div>
                </div>
            </body>
        </>
    );
}

export default MaintenancePage;
