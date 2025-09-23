import React from 'react';
import cn from 'classnames';

const ProductLabel = (props) => {
    const {
        rootClassName = '',
        item
    } = props;

    const preorderData = item ? item.preorder : null;
    const isPreOrder = preorderData && preorderData.is_preorder ? true : false;

    const auctionData = item ? item.auction_data : null;
    const isAuction = auctionData && auctionData.is_auction ? true : false;

    const priceRangeData = item?.price_range;

    const salePrice = priceRangeData?.maximum_price?.discount?.amount_off;
    const regularPrice = priceRangeData?.maximum_price?.regular_price?.value;

    // const isPreOrder = true;
    
    return (
        <div
            className={cn(
                'flex flex-row flex-wrap gap-y-1.5 gap-x-[5px] absolute p-[5px] z-[1]',
                rootClassName
            )}
        >
            {salePrice > 0 && <div className='bg-yellow-400 rounded px-2.5 py-[6px] w-fit top-0 left-0'>
                <span className='text-white text-xs font-medium'>
                    {Math.round(salePrice/regularPrice*100)}% off
                </span>
            </div>}
            {isPreOrder && <div className='bg-darkblue-900 rounded px-2.5 py-[6px] w-fit top-0 left-0'>
                <span className='text-white text-xs font-medium'>
                    Pre Order
                </span>
            </div>}
            {isAuction && <div className='bg-blue-700 rounded px-2.5 py-[6px] w-fit top-0 left-0'>
                <span className='text-white text-xs font-medium'>
                    Auction
                </span>
            </div>}
        </div>
    )
}

export default ProductLabel