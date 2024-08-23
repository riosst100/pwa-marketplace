import React from 'react';
import { Star1 } from 'iconsax-react';

const ProductItem = () => {
    return (
        <>
            <div class="flex-col items-start self-stretch rounded-[8px] overflow-hidden inline-flex relative shadow">
                <img class="relative w-full object-cover" alt="Rectangle" src="https://c.animaapp.com/2pP7niVX/img/rectangle-1-10@2x.png" />
                <div class="flex flex-col items-start gap-[18px] pt-[15px] pb-[20px] px-[15px] relative flex-1 self-stretch w-full grow">
                    <div class="flex items-center gap-[30px] relative self-stretch w-full flex-[0_0_auto]">
                        <div class="flex items-start justify-center gap-[10px] relative flex-1 grow">
                            <p class="line-clamp-2">BANDAI GUNDAM RG 1/144 MSN-04 SAZABI GUNPLA MODEL KIT</p>
                        </div>
                    </div>
                    <div class="inline-flex flex-col items-start gap-[10px] relative flex-[0_0_auto]">
                        <div class="flex flex-col w-[153px] items-start justify-center gap-[8px] relative flex-[0_0_auto]">
                            <div class="flex flex-col items-start gap-[6px] relative self-stretch w-full flex-[0_0_auto]">
                                <div class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-medium text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">$55.00</div>
                            </div>
                        </div>
                        <div class="flex-col items-start gap-[8px] inline-flex relative flex-[0_0_auto]">
                            <div class="inline-flex items-center justify-center gap-[5px] relative flex-[0_0_auto]">
                                <Star1 color='#F7C317' size={12} className='fill-[#F7C317]' />
                                <div class="relative w-fit [font-family:'Noto_Sans',Helvetica] font-normal text-[#1b1b1b] text-[12px] tracking-[0] leading-[normal] whitespace-nowrap">4.7</div>
                            </div>
                            <div class="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                                <img class="relative w-[14px] h-[14px]" alt="Vuesax linear verify" src="https://c.animaapp.com/2pP7niVX/img/vuesax-linear-verify-10.svg" />
                                <div class="relative w-fit [font-family:'Noto_Sans',Helvetica] font-medium text-[#19222ab2] text-[12px] tracking-[0] leading-[normal] whitespace-nowrap">Gundam Info</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                    .line-clamp-2 {
                        display: -webkit-box;
                        overflow: hidden;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                    }
                    .shadow {
                        box-shadow: 0px 0px 7px 2px rgba(205, 205, 205, 0.25);
                    }
                `}
            </style>
        </>
    )
}

export default ProductItem;