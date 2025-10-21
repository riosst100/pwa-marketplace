import React from 'react';
import { useLocation } from 'react-router-dom';
import { bool, shape, string } from 'prop-types';
import { useScrollLock } from '@magento/peregrine';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Footer from '@magento/venia-ui/lib/components/Footer';
import Header from '@magento/venia-ui/lib/components/Header';
import defaultClasses from './main.module.css';
import cn from 'classnames';

const Main = props => {
    const { children, isMasked } = props;
    const location = useLocation();
    const isCheckoutPage = location.pathname === '/checkout';
    const classes = useStyle(defaultClasses, props.classes);

    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;

    useScrollLock(isMasked);

    return (
        <main className={rootClass}>
            {!isCheckoutPage && <Header />}
            <div className={cn(pageClass, 'main-content-container pb-16 !min-h-[50vh]')}>{children}</div>
            {!isCheckoutPage && <Footer />}
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    isMasked: bool
};
