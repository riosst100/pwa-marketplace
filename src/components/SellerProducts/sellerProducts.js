import React from 'react';
import ProductItem from '@riosst100/pwa-marketplace/src/components/ProductItem';
import Filter from '@riosst100/pwa-marketplace/src/components/Filter';
import Search from '@riosst100/pwa-marketplace/src/components/Search';
import SortBy from '@riosst100/pwa-marketplace/src/components/SortBy';
import Pagination from '..//Pagination';
import { Link } from "react-router-dom";

const SellerProducts = () => {
    return (
        <>
            <div className='w-full mb-[30px]'>
                <div class='flex items-end gap-[40px] px-[30px] py-0 rounded-[6px] border border-solid border-gray-100'>
                    <Link to='#' class='px-0 py-[12px] inline-flex items-center gap-[5px] relative flex-[0_0_auto]'>
                        <span class='relative w-fit font-medium text-[14px] tracking-[0] leading-[20px] whitespace-nowrap'>Action Figures</span>
                    </Link>
                    <Link to='#' class='px-0 py-[12px] inline-flex items-center gap-[5px] relative flex-[0_0_auto]'>
                        <span class='relative w-fit font-medium text-[14px] tracking-[0] leading-[20px] whitespace-nowrap'>Anime</span>
                    </Link>
                </div>
            </div>
            <div className='w-full flex items-start gap-x-[30px]'>
                <div className='xs_hidden xl_block filter-container w-full max-w-[240px]'>
                    <Filter />
                </div>
                <div className='flex flex-col gap-y-[30px]'>
                    <div className='flex xs_flex-wrap gap-y-4 w-full items-center justify-between'>
                        <Search />
                        <SortBy />
                    </div>
                    <div className='product-list w-full grid xs_grid-cols-2 md_grid-cols-3 lg_grid-cols-4 gap-4'>
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