import React from 'react';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useIntl } from 'react-intl';
import Item from './item';

const favoriteSeller = () => {

    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'favoriteSellerPage.pageTitleText',
        defaultMessage: 'Favorite Seller'
    });

    return (
        <div className='relative'>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left mb-[30px]">
                {PAGE_TITLE}
            </div>

            <div className='flex flex-col gap-5'>
                {
                    [...Array(5)].map(() => (
                        <Item />
                    ))
                }
            </div>
        </div>
    )
}

export default favoriteSeller