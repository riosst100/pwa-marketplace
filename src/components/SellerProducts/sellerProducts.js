import React from 'react';
import ProductItem from '@riosst100/pwa-marketplace/src/components/ProductItem';
import Filter from '@riosst100/pwa-marketplace/src/components/Filter';
import Search from '@riosst100/pwa-marketplace/src/components/Search';
import SortBy from '@riosst100/pwa-marketplace/src/components/SortBy';
import Pagination from '..//Pagination';

const SellerProducts = () => {
    return (
        <>
            <div className='w-full mb-[30px]'>
                <div class='flex w-[1180px] items-end gap-[40px] px-[30px] py-0 rounded-[6px] border border-solid border-[#e6e9ea]'>
                    <div class='px-0 py-[12px] inline-flex items-center gap-[5px] relative flex-[0_0_auto]'>
                        <div class='relative w-fit font-medium text-[16px] tracking-[0] leading-[20px] whitespace-nowrap'>Action Figures</div>
                    </div>
                    <div class='px-0 py-[12px] inline-flex items-center gap-[5px] relative flex-[0_0_auto]'>
                        <div class='relative w-fit font-medium text-[16px] tracking-[0] leading-[20px] whitespace-nowrap'>Anime</div>
                    </div>
                </div>
            </div>
            <div className='w-full flex items-start gap-x-[30px]'>
                <div className='filter-container w-full max-w-[240px]'>
                    <Filter />
                </div>
                <div className='flex flex-col gap-y-[30px]'>
                    <div className='flex w-full items-center justify-between'>
                        <Search />
                        <SortBy />
                    </div>
                    <div className='product-list w-full grid grid-cols-4 gap-4'>
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                    </div>
                    <div className='pagination-container w-full flex justify-center'>
                        <Pagination />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SellerProducts;