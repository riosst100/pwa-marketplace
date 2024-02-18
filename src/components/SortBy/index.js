import React from 'react';
import { ArrowDown2, Filter } from 'iconsax-react';

const Sort = () => {
    return (
        <>
            <div className='x-container xs_flex xs_justify-between xs_w-full xl_w-fit'>
                <div class="xs_flex xl_hidden flex-col items-start gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] bg-white rounded-[30px] border border-solid border-gray-100">
                    <div class="inline-flex items-center gap-[20px] relative flex-[0_0_auto]">
                        <Filter color="#292D32" size={14} variant="Outline" className='stroke-[#292D32]' />
                        <div class="relative w-fit text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Filter</div>
                    </div>
                </div>
                <div class="inline-flex flex-col items-start gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] bg-white rounded-[30px] border border-solid border-gray-100">
                    <div class="inline-flex items-center gap-[20px] relative flex-[0_0_auto]">
                        <div class="relative w-fit text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Most relevant</div>
                        <ArrowDown2 color="#292D32" size={14} variant="Outline" className='stroke-[#292D32]' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sort;