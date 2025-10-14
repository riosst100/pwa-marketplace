import React from 'react';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useIntl } from 'react-intl';
import Item from './item';
import useFavoriteSellerList from '@riosst100/pwa-marketplace/src/talons/FavoriteSeller/FavoriteSellerList/useFavoriteSellerList';

const FavoriteSeller = () => {
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'favoriteSellerPage.pageTitleText',
        defaultMessage: 'Favorite Seller'
    });

    // Fetch favorite seller list
    const { data, loading, error, refetch } = useFavoriteSellerList();

    return (
        <div className='relative'>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left mb-[30px]">
                {PAGE_TITLE}
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className='flex flex-col gap-5'>
                    {error && <div>Error loading favorite sellers.</div>}
                    {data && data.items && data.items.length > 0 ? (
                        data.items.map(sellerItem => (
                            <Item key={sellerItem.id} sellerItem={sellerItem} refetchFavoriteSellerList={refetch} />
                        ))
                    ) : !error ? (
                        <div>No favorite sellers found.</div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default FavoriteSeller;
