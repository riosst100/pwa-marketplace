import React from 'react'
import { Link } from 'react-router-dom';
import Icon from '@magento/venia-ui/lib/components/Icon';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Heart as HeartIcon } from 'react-feather';

const wishlistTrigger = () => {
    return (
        <div className='wishlistTrigger'>
            <Link
                aria-label='wishlist-action'
                to={resourceUrl('/wishlist')}
                className={''}
                data-cy="wishlistLink"
            >
                <Icon src={HeartIcon} attrs={{ width: 20 }} />
                {/* <Heart size="20" color={darkBlue} className={cn('stroke-0')} variant="Outline" /> */}
            </Link>
        </div>
    )
}

export default wishlistTrigger