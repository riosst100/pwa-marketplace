import React from 'react';
import { Location, Clock } from 'iconsax-react';

const SellerLocationItem = () => {
    return (
        <>
            <div class="flex flex-col w-full items-start gap-[15px] p-[20px] relative rounded-[8px] border border-solid border-[#e6e9ea]">
                <div class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-semibold text-[16px] tracking-[0] leading-[normal]">Zen Market Kitchener</div>
                <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                    <Location color="#1B1B1B" size={18} variant="Outline" className='stroke-[#1B1B1B] stroke-[0.5px]' />
                    <div class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[normal]">180 Kitchener Rd, Singapura</div>
                </div>
                <div class="flex flex-col w-[320px] items-end relative flex-[0_0_auto] mr-[-10.00px]">
                    <div class="flex items-center gap-[10px] relative self-stretch w-full flex-[0_0_auto]">
                        <Clock color="#1B1B1B" size={18} variant="Outline" className='stroke-[#1B1B1B] stroke-[0.5px]' />
                        <p class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[24px] whitespace-nowrap">Monday - Friday 9 AM - 5 PM</p>
                    </div>
                    <p class="relative w-[292px] [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[24px]">
                        Saturday 11 AM - 3 PM<br />
                        Sunday Close
                    </p>
                </div>
            </div>
        </>
    )
}

export default SellerLocationItem;