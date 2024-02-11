import React from 'react';
import { Star1 } from 'iconsax-react';

const ReviewItem = () => {
    return (
        <>
            <div class="flex flex-col items-start gap-[10px] p-[25px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[6px] border border-solid border-[#e6e9ea]">
                <div class="flex flex-col items-start gap-[20px] relative self-stretch w-full flex-[0_0_auto]">
                    <div class="inline-flex flex-col items-start gap-[10px] relative flex-[0_0_auto]">
                        <div class="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                            <div class="flex w-[40px] h-[40px] items-center justify-around gap-[10px] p-[10px] relative bg-[#4e31db] rounded-[30px]">
                                <div class="relative w-fit [font-family:'Noto_Sans',Helvetica] font-semibold text-white text-[16px] text-center tracking-[0] leading-[18px] whitespace-nowrap">JD</div>
                            </div>
                            <div class="inline-flex flex-col items-start gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-fit mt-[-1.00px] [font-family:'Noto_Sans',Helvetica] font-medium text-[14px] text-center tracking-[0] leading-[18px] whitespace-nowrap">John Doe</div>
                                <div class="relative w-fit [font-family:'Noto_Sans',Helvetica] font-medium text-[#999999] text-[12px] text-center tracking-[0] leading-[18px] whitespace-nowrap">18 January 2024</div>
                            </div>
                        </div>
                        <div class="inline-flex items-start gap-[20px] relative flex-[0_0_auto]">
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-fit [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[18px] whitespace-nowrap">Price</div>
                                <div class="inline-flex items-start gap-[6px] relative flex-[0_0_auto]">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#D9D9D9' size={14} className='fill-[#D9D9D9]' />
                                </div>
                            </div>
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-[37px] [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[18px]">Value</div>
                                <div class="inline-flex items-start gap-[6px] relative flex-[0_0_auto]">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#D9D9D9' size={14} className='fill-[#D9D9D9]' />
                                </div>
                            </div>
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-fit [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[18px] whitespace-nowrap">Quality</div>
                                <div class="inline-flex items-start gap-[6px] relative flex-[0_0_auto]">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    <Star1 color='#D9D9D9' size={14} className='fill-[#D9D9D9]' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="relative self-stretch [font-family:'Noto_Sans',Helvetica] font-normal text-[14px] tracking-[0] leading-[18px]">
                        Got item at a great price. Arrived way quicker than expected, extremely well packaged and exactly as described. Highly recommend the seller.
                    </p>
                </div>
            </div>
        </>
    )
}

export default ReviewItem;