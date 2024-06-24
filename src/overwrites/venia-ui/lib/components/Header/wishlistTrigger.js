import React from 'react'
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Heart } from 'iconsax-react';
import { darkBlue } from '@riosst100/pwa-marketplace/src/theme/vars';
import cn from 'classnames';

const wishlistTrigger = () => {
    return (
        <div className='wishlistTrigger'>
            <Link
                aria-label='wishlist-action'
                to={resourceUrl('/wishlist')}
                className={''}
                data-cy="wishlistLink"
            >
                <Heart size="25" color={darkBlue} className={cn('stroke-0')} variant="Outline" />
            </Link>
        </div>
    )
}

export default wishlistTrigger