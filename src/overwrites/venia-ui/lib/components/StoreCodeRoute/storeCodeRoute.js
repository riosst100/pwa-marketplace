// import { useEffect, useMemo } from 'react';
// import { useHistory } from 'react-router-dom';
// import { BrowserPersistence } from '@magento/peregrine/lib/util';
// import { useCartContext } from '@magento/peregrine/lib/context/cart';
// import { useApolloClient, useQuery } from '@apollo/client';

// const storage = new BrowserPersistence();

/**
 * This component checks for use of a store code in the url that is not the
 * current base. If found, it updates the local storage values for code/currency
 * and reloads the page so that they are used in the graphQL headers.
 */
const StoreCodeRoute = () => {
    // const history = useHistory();

    // const websiteCodes = [];
    // const websiteStores = useMemo(() => ({}), []);
    // const storeCurrencies = useMemo(() => ({}), []);
    // const storeSecureBaseMediaUrl = useMemo(() => ({}), []);

    // AVAILABLE_WEBSITES.forEach(store => {
    //     websiteCodes.push(store.website_code);
    //     websiteStores[store.website_code] = store.store_code;
    //     storeCurrencies[store.store_code] = store.default_display_currency_code;
    //     storeSecureBaseMediaUrl[store.store_code] = store.secure_base_media_url;
    // });

    // // Sort by length (longest first) to avoid false hits ie "en" matching just
    // // the "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
    // websiteCodes.sort((a, b) => b.length - a.length);

    // // Find the store code in the url. This will always be the first path.
    // // ie `https://example.com/fr/foo/baz.html` => `fr`.
    // const { location } = globalThis;
    // const match = location && location.pathname.split("/")[1];
    // let websiteCodeInUrl = websiteCodes.find((str) => str === match);

    // // Determine what the current store code is using the configured basename.
    // const currentWebsiteCode = storage && storage.getItem('website_code') || process.env.WEBSITE_CODE;

    

    // If we find a store code in the url that is not the current one, update
    // the storage value and refresh so that we start using the new code.
    // useEffect(() => {
    //     if (!websiteCodeInUrl) {
    //         history.replace(location.pathname + location.search)
    //     } else if (websiteCodeInUrl && websiteCodeInUrl !== currentWebsiteCode) {
    //         const storeCodeInUrl = websiteStores[websiteCodeInUrl];

            // alert(storeCodeInUrl)

            // update store/website saat url berubah, misal /id ke /sg

            // issue store view code gk berubah, klo di graphql aman

            // ini update di graphql dan di cookie, tapi di cookie beda klo ga di hardcode

            // ini oke, store di graphql dari sini
            // storeCodeInUrl = 'id_id_store_view';
            // console.log('storeCodeInUrl',storeCodeInUrl)

            // await apolloClient.clearCacheData(apolloClient, 'cart');
            // await removeCart();

            // storage.setItem('store_view_code', storeCodeInUrl);
            // storage.setItem('website_code', websiteCodeInUrl);
            // storage.setItem(
            //     'store_view_currency',
            //     storeCurrencies[storeCodeInUrl]
            // );
            // storage.setItem(
            //     'store_view_secure_base_media_url',
            //     storeSecureBaseMediaUrl[storeCodeInUrl]
            // );

            // We're required to reload the page as the basename doesn't
            // change entirely without a full page reload.
            // history.go(0);
    //     }
    // }, [
    //     websiteCodeInUrl,
    //     // currentWebsiteCode,
    //     history
    //     // , apolloClient, removeCart
    //     // storeCodeInUrl,
    //     // storeCurrencies,
    //     // storeSecureBaseMediaUrl
    // ]);

    return null;
};

export default StoreCodeRoute;
