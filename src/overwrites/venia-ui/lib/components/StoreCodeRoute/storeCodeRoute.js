import { useEffect, useMemo } from 'react';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

/**
 * This component checks for use of a store code in the url that is not the
 * current base. If found, it updates the local storage values for code/currency
 * and reloads the page so that they are used in the graphQL headers.
 */
const StoreCodeRoute = () => {

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

    // Sort by length (longest first) to avoid false hits ie "en" matching just
    // the "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
    websiteCodes.sort((a, b) => b.length - a.length);

    // Find the store code in the url. This will always be the first path.
    // ie `https://example.com/fr/foo/baz.html` => `fr`.
    const { location } = globalThis;
    const match = location && location.pathname.split("/")[1];
    const defaultWebsiteCode = process.env.WEBSITE_CODE;
    let websiteCodeInUrl = websiteCodes.find((str) => str === match);

    // Determine what the current store code is using the configured basename.

    // If we find a store code in the url that is not the current one, update
    // the storage value and refresh so that we start using the new code.
    useEffect(() => {
        if (websiteCodeInUrl) {
            const websiteCodes = [];

            AVAILABLE_WEBSITES.forEach(store => {
                websiteCodes.push(store.website_code);
            });

            const { location } = globalThis;
            const match = location && location.pathname.split("/")[1];
            const websiteCodeInUrl = websiteCodes.find((str) => str === match);

            const prefix = websiteCodeInUrl ? websiteCodeInUrl + '_' : '';
            
            let storeCodeInUrl = websiteStores[websiteCodeInUrl];

            storage.setItem(prefix + 'store_view_code', storeCodeInUrl);
            storage.setItem(prefix + 'website_code', websiteCodeInUrl);
            storage.setItem(
                prefix + 'store_view_currency',
                storeCurrencies[storeCodeInUrl]
            );

            storage.setItem(
                prefix + 'store_view_secure_base_media_url',
                storeSecureBaseMediaUrl[storeCodeInUrl]
            );
        }
    }, [
        websiteCodeInUrl
    ]);

    return null;
};

export default StoreCodeRoute;
