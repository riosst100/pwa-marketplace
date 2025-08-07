import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export const useBecomeSellerLink = (props = {}) => {
    const isSeller = storage.getItem('is_seller') || false;

    return {
        isSeller
    };
};
