import React, { useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StoreCodeRoute from '@magento/venia-ui/lib/components/StoreCodeRoute';
import { useWebsiteByIp } from '@riosst100/pwa-marketplace/src/talons/WebsiteByIp/useWebsiteByIp';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import MaintenancePage from '@riosst100/pwa-marketplace/src/components/MaintenancePage';
import axios from 'axios';

const storage = new BrowserPersistence();

const Adapter = props => {
    const [verifyUserIp, setVerifyUserIp] = useState(true);
    const [newRouterProps, setNewRouterProps] = useState(true);

    const talonProps = useAdapter(props);
    let {
        apolloProps,
        initialized,
        reduxProps,
        routerProps,
        isMaintenance,
        isCheckingMaintenance,
        apiBase
    } = talonProps;

    if (isCheckingMaintenance) {
        return null;
    }

    // console.log('isMaintenance',isMaintenance)

    // useEffect(() => {
    //     const fetchData = async () => {
    //         axios.get(apiBase).then((response) => {
    //             // setIsMaintenance(false)
    //         }).catch((error) => {
    //             const status = error.response.status;
    //             if (status != 200) {
    //                 console.log('status',status)
    //                 return <MaintenancePage />;
    //                 // setIsMaintenance(true)
    //             }
    //         });
    //     };
    
    //     fetchData();
   

    // if (isMaintenance) {
    //     return <MaintenancePage />;
    // }

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
    const pathname = location.pathname;
    const match = location && location.pathname.split("/")[1];
    let websiteCodeInUrl = websiteCodes.find((str) => str === match);

    // const { getWebsiteByUserIp } = useWebsiteByIp(websiteCodeInUrl);
    const getWebsiteByUserIp = {
        countryCode: 'SG'
    }
    
    useEffect(() => {
        if (websiteCodeInUrl) {
            setVerifyUserIp(false);

            storage.removeItem('access_base_website');

            routerProps.basename = websiteCodeInUrl != process.env.WEBSITE_CODE ? '/'+websiteCodeInUrl : '/';

            setNewRouterProps(routerProps);
        }
    }, [websiteCodeInUrl])

    const currentWebsiteCode = storage && storage.getItem('website_code') || process.env.WEBSITE_CODE;

    useEffect(() => {
        if (!websiteCodeInUrl) {
            // history.replace(location.pathname + location.search)
        } else if (websiteCodeInUrl && websiteCodeInUrl !== currentWebsiteCode) {
            const storeCodeInUrl = websiteStores[websiteCodeInUrl];



            // const search = location.search;
            
            // const query = new URLSearchParams(search);
            // const isAccessBaseWebsite = query.get('access_base_website') || (
            //     storage.getItem('access_base_website') || null
            // );

            // routerProps.basename = websiteCodeInUrl != process.env.WEBSITE_CODE && !isAccessBaseWebsite ? '/'+websiteCodeInUrl : '/';

            // setNewRouterProps(routerProps);

            // await removeCart();

            // alert(storeCodeInUrl)

            // update store/website saat url berubah, misal /id ke /sg

            // issue store view code gk berubah, klo di graphql aman

            // ini update di graphql dan di cookie, tapi di cookie beda klo ga di hardcode

            // ini oke, store di graphql dari sini
            // storeCodeInUrl = 'id_id_store_view';
            // console.log('storeCodeInUrl',storeCodeInUrl)

            // await apolloClient.clearCacheData(apolloClient, 'cart');
            // await removeCart();

            // klo enabled jd redirect tros
            storage.removeItem('cartId');

            storage.setItem('store_view_code', storeCodeInUrl);
            storage.setItem('website_code', websiteCodeInUrl);
            storage.setItem(
                'store_view_currency',
                storeCurrencies[storeCodeInUrl]
            );
            storage.setItem(
                'store_view_secure_base_media_url',
                storeSecureBaseMediaUrl[storeCodeInUrl]
            );

            // We're required to reload the page as the basename doesn't
            // change entirely without a full page reload.
            // history.go(0);
        }

        if (!websiteCodeInUrl && getWebsiteByUserIp) {
            setVerifyUserIp(false);

            const search = location.search;
            
            const query = new URLSearchParams(search);
            const isAccessBaseWebsite = query.get('access_base_website') || (
                storage.getItem('access_base_website') || null
            );

            // const websiteCode = getWebsiteByUserIp.countryCode && !isAccessBaseWebsite ? getWebsiteByUserIp.countryCode.toLowerCase() : process.env.WEBSITE_CODE;
            const websiteCode = process.env.WEBSITE_CODE;

            if (websiteCodes.find((str) => str === websiteCode)) {
                routerProps.basename = websiteCode != process.env.WEBSITE_CODE && !isAccessBaseWebsite ? '/'+websiteCode : '/';

                setNewRouterProps(routerProps);

                if (isAccessBaseWebsite) {
                    storage.setItem('access_base_website', 1);
                }

                let storeCodeInUrl = websiteStores[websiteCode];

                storage.removeItem('cartId');

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
        }
    }, [websiteCodeInUrl, getWebsiteByUserIp]);

    // TODO: Replace with app skeleton. See PWA-547.
    if (!initialized) {
        return null;
    }

    if (isMaintenance) {
        return <MaintenancePage />;
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
