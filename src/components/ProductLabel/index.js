import React from 'react';
import cn from 'classnames';

const ProductLabel = (props) => {
    const {
        rootClassName = '',
    } = props;
    return (
        <div
            className={cn(
                'flex flex-row flex-wrap gap-y-1.5 gap-x-[5px] absolute p-[5px] z-[1]',
                rootClassName
            )}
        >
            <div className='bg-yellow-400 rounded px-2.5 py-[6px] w-fit top-0 left-0'>
                <span className='text-white text-xs font-medium'>
                    10% off
                </span>
            </div>
            <div className='bg-darkblue-900 rounded px-2.5 py-[6px] w-fit top-0 left-0'>
                <span className='text-white text-xs font-medium'>
                    Pre Order
                </span>
            </div>
            <div className='bg-blue-700 rounded px-2.5 py-[6px] w-fit top-0 left-0'>
                <span className='text-white text-xs font-medium'>
                    Auction
                </span>
            </div>
        </div>
    )
}

export default ProductLabel