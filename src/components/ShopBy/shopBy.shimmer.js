import React from 'react';
import { shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import defaultClasses from './shopBy';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';

const ShopBy = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <>
            <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'><Shimmer width="25%" height="6vh" /></h1>
            <div className='border border-gray-100 px-6'>
                <center>
                    <section className='single_list-indexing-container relative m-auto pt-5'>
                        <Shimmer width="95%" height="6vh" />
                    </section>
                </center>
                <Divider className="mb-5 px-4" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                            <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' ><Shimmer width="95%" height="100vh" /></div>
                        </div>
                        <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                            <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' ><Shimmer width="95%" height="100vh" /></div>
                        </div>
                        <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                            <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' ><Shimmer width="95%" height="100vh" /></div>
                        </div>
                        <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                            <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' ><Shimmer width="95%" height="100vh" /></div>
                        </div>
                        <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                            <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' ><Shimmer width="95%" height="100vh" /></div>
                        </div>
                        <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                            <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' ><Shimmer width="95%" height="100vh" /></div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ShopBy;
