import React from 'react';
import { Location, Clock } from 'iconsax-react';
import OperatingHours from '@riosst100/pwa-marketplace/src/components/OperatingHours';
import SellerAddressCard from '@riosst100/pwa-marketplace/src/components/Seller/sellerAddressCard';

const SellerLocationItem = ({ storeLocator }) => {
    return storeLocator && (
        <>
            <div class="flex flex-col w-full items-start gap-[15px] p-[20px] relative rounded-[8px] border border-solid border-[#e6e9ea]">
                <div class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-semibold text-[16px] tracking-[0] leading-[normal]">{storeLocator ? storeLocator.name : ''}</div>
                <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                    <Location color="#1B1B1B" size={18} variant="Outline" className='stroke-[#1B1B1B] stroke-[0.5px]' />
                    <div class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[normal]">
                        {storeLocator.city}, {storeLocator.country}
                    </div>
                </div>
                <div class="flex flex-col w-[320px] items-end relative flex-[0_0_auto] mr-[-10.00px]">
                    <div class="flex items-center gap-[10px] relative self-stretch w-full flex-[0_0_auto]">
                        <Clock color="#1B1B1B" size={18} variant="Outline" className='stroke-[#1B1B1B] stroke-[0.5px]' />
                        <p class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">{storeLocator ? <OperatingHours values={storeLocator.operating_hours} /> : ''}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SellerLocationItem;