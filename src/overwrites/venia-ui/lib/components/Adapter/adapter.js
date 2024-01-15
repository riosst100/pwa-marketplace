import React, { useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StoreCodeRoute from '@magento/venia-ui/lib/components/StoreCodeRoute';
import { useWebsiteByIp } from '@riosst100/pwa-multi-website/src/talons/WebsiteByIp/useWebsiteByIp';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const Adapter = props => {
    const [verifyUserIp, setVerifyUserIp] = useState(true);
    const [newRouterProps, setNewRouterProps] = useState(true);

    const talonProps = useAdapter(props);
    let {
        apolloProps,
        initialized,
        reduxProps,
        routerProps
    } = talonProps;

    const websiteCodes = [];
    const websiteStores = useMemo(() => ({}), []);
    const storeCurrencies = useMemo(() => ({}), []);
    const storeSecureBaseMediaUrl = useMemo(() => ({}), []);

    AVAILABLE_WEBSITES.forEach(store => {
        websiteCodes.push(store.website_code);
        websiteStores[store.website_code] = store.store_code;
        storeCurrencies[store.store_code] = store.default_display_currency_code;
        storeSecureBaseMediaUrl[store.store_code] = store.secure_base_media_url;
    });

    websiteCodes.sort((a, b) => b.length - a.length);

    const { location } = globalThis;
    const match = location && location.pathname.split("/")[1];
    let websiteCodeInUrl = websiteCodes.find((str) => str === match);

    const { getWebsiteByUserIp } = useWebsiteByIp(websiteCodeInUrl);
    
    useEffect(() => {
        if (websiteCodeInUrl) {
            setVerifyUserIp(false);

            storage.removeItem('access_base_website');

            routerProps.basename = websiteCodeInUrl != process.env.WEBSITE_CODE ? '/'+websiteCodeInUrl : '/';

            setNewRouterProps(routerProps);
        }
    }, [websiteCodeInUrl])

    useEffect(() => {
        if (!websiteCodeInUrl && getWebsiteByUserIp) {
            setVerifyUserIp(false);
            
            const query = new URLSearchParams(location.search);
            const isAccessBaseWebsite = query.get('access_base_website') || (
                storage.getItem('access_base_website') || null
            );

            const websiteCode = getWebsiteByUserIp.countryCode && !isAccessBaseWebsite ? getWebsiteByUserIp.countryCode.toLowerCase() : process.env.WEBSITE_CODE;

            routerProps.basename = websiteCode != process.env.WEBSITE_CODE && !isAccessBaseWebsite ? '/'+websiteCode : '/';

            setNewRouterProps(routerProps);

            if (isAccessBaseWebsite) {
                storage.setItem('access_base_website', 1);
            }

            let storeCodeInUrl = websiteStores[websiteCode];

            storage.setItem('store_view_code', storeCodeInUrl);
            storage.setItem('website_code', websiteCode);
            storage.setItem(
                'store_view_currency',
                storeCurrencies[storeCodeInUrl]
            );
            storage.setItem(
                'store_view_secure_base_media_url',
                storeSecureBaseMediaUrl[storeCodeInUrl]
            );
        }
    }, [websiteCodeInUrl, getWebsiteByUserIp])

    // TODO: Replace with app skeleton. See PWA-547.
    if (!initialized) {
        return null;
    }

    const children = props.children || <App />;

    return !verifyUserIp && (
        <ApolloProvider {...apolloProps}>
            <ReduxProvider {...reduxProps}>
                <BrowserRouter {...newRouterProps}>
                    <StoreCodeRoute />
                    <AppContextProvider>{children}</AppContextProvider>
                </BrowserRouter>
            </ReduxProvider>
        </ApolloProvider>
    );
};

export default Adapter;
