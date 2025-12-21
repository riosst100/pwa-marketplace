import { setContext } from '@apollo/client/link/context';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export default function createStoreLink() {
    return setContext((_, { headers }) => {
        const websiteCodes = [];

        AVAILABLE_WEBSITES.forEach(store => {
            websiteCodes.push(store.website_code);
        });
        
        const { location } = globalThis;
        const match = location && location.pathname.split("/")[1];
        const websiteCodeInUrl = websiteCodes.find((str) => str === match);

        let prefix = websiteCodeInUrl ? websiteCodeInUrl + '_' : '';

        const storeCurrency = storage.getItem(prefix + 'store_view_currency') || null;
        const storeCode = storage.getItem(prefix + 'store_view_code') || STORE_VIEW_CODE;

        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                store: storeCode,
                ...(storeCurrency && {
                    'Content-Currency': storeCurrency
                })
            }
        };
    });
}
