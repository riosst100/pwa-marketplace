import React from 'react';
import Item from './item';

const crossSellerBuy = () => {
    return (
        <>
            <h3 className='capitalize font-medium text-xl mb-[30px]'>
                Also Available
            </h3>
            <div className='flex flex-col gap-y-5'>
                {[...Array(6)].map(() => (
                    <Item />
                ))}
            </div>
        </>
    )
}

export default crossSellerBuy