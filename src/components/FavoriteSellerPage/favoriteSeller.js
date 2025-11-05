import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useIntl } from 'react-intl';
import Item from './item';
import useFavoriteSellerList from '@riosst100/pwa-marketplace/src/talons/FavoriteSeller/FavoriteSellerList/useFavoriteSellerList';
// import defaultClasses from './favoriteSeller.module.css';
import defaultClasses from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/RootComponents/Category/category.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Pagination from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Pagination';
import React, { Fragment, Suspense, useMemo, useRef } from 'react';

const FavoriteSeller = (props) => {
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'favoriteSellerPage.pageTitleText',
        defaultMessage: 'Followed Stores'
    });
    
    const classes = useStyle(defaultClasses, props.classes);
    
    // Fetch favorite seller list
    const { data, loading, error, refetch, totalPagesFromData, pageControl } = useFavoriteSellerList();

    const pagination = totalPagesFromData ? (
        <Pagination pageControl={pageControl} />
    ) : null;

    const content = useMemo(() => {
        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} />
        ) : null;

        return (
            <Fragment>
                <section className={classes.gallery}>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div className='flex flex-col gap-5'>
                                {error && <div>Error loading favorite sellers.</div>}
                                {data && data.items && data.items.length > 0 ? (
                                    data.items.map(sellerItem => (
                                        <Item key={sellerItem.id} sellerItem={sellerItem} refetchFavoriteSellerList={refetch} />
                                    ))
                                ) : !error ? (
                                    <div>No favorite sellers found.</div>
                                ) : null}
                                {data?.items?.length > 0 && <div className={classes.pagination}>{pagination}</div>}
                            </div>
                        </>
                    )}
                </section>
            </Fragment>
        );
    }, [
        classes.gallery,
        classes.pagination,
        pageControl,
        loading,
        data,
        error,
        totalPagesFromData
    ]);

    return (
        <Fragment>
            <div className='relative'>
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <div aria-live="polite" className="text-xl font-medium text-left mb-[20px]">
                    {PAGE_TITLE}
                </div>
                <p>This list shows all the stores you're currently following. Sellers may send you newsletters or updates — you can unfollow a seller anytime to stop following and unsubscribe from their newsletters.</p>
                <br />
                {content}
            </div>
        </Fragment>
    );
};

export default FavoriteSeller;
