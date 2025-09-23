import React from 'react';
import { ArrowSquareUp, Filter } from 'iconsax-react';

const CatalogFilter = () => {
    return (
        <>
            <div className='inline-flex flex-col items-start gap-[10px] px-0 py-[10px] w-full rounded-[6px] overflow-hidden border border-solid border-[#e6e9ea] shadow-[0px_0px_7px_2px_#cdcdcd40]'>
                <div class="flex h-[18px] items-center justify-between px-[10px] py-0 relative self-stretch w-full">
                    <div class="relative w-fit text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                        Filter
                    </div>
                    <Filter color="#292D32" size={16} variant="Outline" className='stroke-[#292D32]' />
                </div>
                <div class="inline-flex flex-col items-start gap-[10px] bg-white relative flex-[0_0_auto]">
                    <div class="flex-col justify-center inline-flex items-center relative flex-[0_0_auto]">
                        <div class="flex w-full cursor-pointer items-center justify-between p-[10px] relative flex-[0_0_auto] bg-white">
                            <div class="relative w-fit font-medium text-base tracking-[0] leading-[18px] whitespace-nowrap">Category</div>
                            <ArrowSquareUp color="#292D32" size={14} variant="Outline" />
                        </div>
                        <hr className='w-full h-[1px]' />
                        <div class="inline-flex flex-col items-start gap-[15px] p-[10px] relative flex-[0_0_auto] bg-white">
                            <div class="flex flex-col w-[220px] items-start gap-[12px] relative flex-[0_0_auto]">
                                <div class="gap-[8px] inline-flex items-center relative flex-[0_0_auto]">
                                    <input type='checkbox' class="relative w-[14px] h-[14px] bg-white rounded-[4px] border border-solid border-[#009a7b]" />
                                    <div class="relative w-fit  font-normal text-[12px] tracking-[0] leading-[14px] whitespace-nowrap">Action figures</div>
                                </div>
                                <div class="inline-flex items-center gap-[8px] relative flex-[0_0_auto]">
                                    <input type='checkbox' class="relative w-[14px] h-[14px] bg-white rounded-[4px] border border-solid border-[#009a7b]" />
                                    <div class="relative w-fit  font-normal text-[12px] tracking-[0] leading-[14px] whitespace-nowrap">Gundam</div>
                                </div>
                                <div class="gap-[8px] inline-flex items-center relative flex-[0_0_auto]">
                                    <input type='checkbox' class="relative w-[14px] h-[14px] bg-white rounded-[4px] border border-solid border-[#009a7b]" />
                                    <div class="relative w-fit  font-normal text-[12px] tracking-[0] leading-[14px] whitespace-nowrap">Puzzles</div>
                                </div>
                                <div class="inline-flex items-center gap-[8px] relative flex-[0_0_auto]">
                                    <input type='checkbox' class="relative w-[14px] h-[14px] bg-white rounded-[4px] border border-solid border-[#009a7b]" />
                                    <div class="relative w-fit  font-normal text-[12px] tracking-[0] leading-[14px] whitespace-nowrap">Japan Culture</div>
                                </div>
                                <div class="inline-flex items-center gap-[8px] relative flex-[0_0_auto]">
                                    <input type='checkbox' class="relative w-[14px] h-[14px] bg-white rounded-[4px] border border-solid border-[#009a7b]" />
                                    <div class="relative w-fit  font-normal text-[12px] tracking-[0] leading-[14px] whitespace-nowrap">Sci-fi</div>
                                </div>
                                <div class="relative w-fit  font-normal text-[#009a7b] text-[12px] tracking-[0] leading-[14px] underline whitespace-nowrap cursor-pointer">Show More</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CatalogFilter