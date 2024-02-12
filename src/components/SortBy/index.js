import React from 'react';
import { ArrowDown2 } from 'iconsax-react';

const Sort = () => {
    return (
        <>
            <div class="inline-flex flex-col items-start gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] bg-white rounded-[30px] border border-solid border-[#e6e9ea]">
                <div class="inline-flex items-center gap-[20px] relative flex-[0_0_auto]">
                    <div class="relative w-fit [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Most relevant</div>
                    <ArrowDown2 color="#292D32" size={14} variant="Outline" className='stroke-[#292D32]' />
                </div>
            </div>
        </>
    )
}

export default Sort;