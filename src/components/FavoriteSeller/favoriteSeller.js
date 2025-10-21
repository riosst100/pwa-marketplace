import React from 'react';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useIntl } from 'react-intl';
import Item from './item';
import defaultClasses from './favoriteSeller.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Pagination from '../../components/Pagination';

const favoriteSeller = () => {
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'favoriteSellerPage.pageTitleText',
        defaultMessage: 'Followed Stores'
    });

    const pagination = totalPagesFromData ? (
        <Pagination pageControl={pageControl} />
    ) : null;

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
            <div className={classes.pagination}>{pagination}</div>
        </div>
    )
}

export default favoriteSeller