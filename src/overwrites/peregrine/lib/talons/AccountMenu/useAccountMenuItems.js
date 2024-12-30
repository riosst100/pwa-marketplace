import { useCallback, useEffect } from 'react';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { onSignOut } = props;

    const handleSignOut = useCallback(() => {
        onSignOut();
    }, [onSignOut]);

    let MENU_ITEMS = [
        {
            name: 'Order History',
            id: 'accountMenu.orderHistoryLink',
            url: '/order-history'
        },
        // Hide links until features are completed
        // {
        //     name: 'Store Credit & Gift Cards',
        //     id: 'accountMenu.storeCreditLink',
        //     url: ''
        // },
        {
            name: 'Wishlist',
            id: 'accountMenu.favoritesListsLink',
            url: '/wishlist'
        },
        {
            name: 'Address Book',
            id: 'accountMenu.addressBookLink',
            url: '/address-book'
        },
        {
            name: 'Saved Payments',
            id: 'accountMenu.savedPaymentsLink',
            url: '/saved-payments'
        },
        {
            name: 'Communications',
            id: 'accountMenu.communicationsLinak',
            url: '/communications'
        },
        {
            name: 'Account Information',
            id: 'accountMenu.accountInfoLink',
            url: '/account-information'
        }
    ];
    
    if (storage && storage.getItem('is_seller')) {
        MENU_ITEMS = [
            ...MENU_ITEMS,
            {
                name: 'Seller Account Information',
                id: 'accountMenu.sellerAccountInfoLink',
                url: '/seller-account'
            }
        ];
    }

    return {
        handleSignOut,
        menuItems: MENU_ITEMS
    };
};
