import React from 'react';
import Slider from '@riosst100/pwa-marketplace/src/components/commons/Slider';
import Tabs from '@riosst100/pwa-marketplace/src/components/commons/Tabs';
import SellerProducts from '../SellerProducts';
import SellerInformation from '../SellerInformation';
import Reviews from '../SellerReview';
import {
    Verify,
    Sms,
    Message,
    Heart,
    Share,
    BoxTick,
    Star1,
} from 'iconsax-react';

const SellerPage = () => {
    const dataTabs =
        [
            {
                id: 'product-tab',
                title: 'All Products',
                content: <SellerProducts />
            },
            {
                id: 'store-information',
                title: 'Store Information',
                content: <SellerInformation />
            },
            {
                id: 'reviews',
                title: 'Reviews',
                content: <Reviews />
            }
        ];
    return (
        <div className=' py-8'>
            <Slider rootClassname='mb-[30px]' />
            <div className='flex items-center justify-between mb-[30px] p-[20px] rounded-[6px] border border-solid border-[#e6e9ea] shadow-[0px_0px_5px_3px_#d9d9d933]'>
                <div className='inline-flex items-center gap-[15px] relative flex-[0_0_auto]'>
                    <img className="relative w-[100px] h-[100px] object-cover" alt="Rectangle" src="https://c.animaapp.com/2pP7niVX/img/rectangle-81@2x.png" />
                    <div className='inline-flex flex-col h-[100px] items-start justify-between relative flex-[0_0_auto]'>
                        <div className='inline-flex flex-col items-start gap-[6px] relative flex-[0_0_auto]'>
                            <div className="items-center gap-[10px] inline-flex relative flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] font-semibold text-[#1b1b1b] text-[20px] tracking-[0] leading-[24px] whitespace-nowrap">
                                    Zen Market
                                </div>
                                <div className="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                                    <Verify variant='Bold' color='#4E31DB' size={20} />
                                    <div className="relative w-fit font-medium text-[#192221b3] text-[12px] tracking-[0] leading-[normal] whitespace-nowrap">
                                        Verified
                                    </div>
                                </div>
                            </div>
                            <div class="relative w-fit font-normal text-[#999999] text-[12px] tracking-[0] leading-[14px] whitespace-nowrap">
                                Jurong west
                            </div>
                        </div>
                        <div className='inline-flex items-start gap-[15px] relative flex-[0_0_auto]'>
                            <div class="flex items-center justify-center gap-[5px] px-[20px] py-[8px] relative bg-white rounded-[30px] border border-solid border-[#6243fa]">
                                <div class="inline-flex items-center justify-center gap-[10px] relative flex-[0_0_auto]">
                                    <Sms color="#6243FA" size={14} variant="Outline" className='stroke-[#6243FA]' />
                                    <div class="relative w-fit mt-[-1.00px] font-medium text-[#6243fa] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                        Message
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-center gap-[5px] px-[20px] py-[8px] relative bg-[#280135] rounded-[30px] border border-solid border-[#280135]">
                                <div class="inline-flex items-center justify-center gap-[10px] relative flex-[0_0_auto]">
                                    <Message color='#FFFFFF' size={14} variant="Outline" className='stroke-[#FFFFFF]' />
                                    <div class="relative w-fit mt-[-1.00px] font-medium text-[#fff] text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                                        Chat With Seller
                                    </div>
                                </div>
                            </div>
                            <div class="inline-flex items-center justify-center gap-[5px] p-[11px] relative flex-[0_0_auto] bg-white rounded-[30px] overflow-hidden border border-solid border-[#6243fa]">
                                <Heart color='#6243FA' size={14} variant="Outline" className='stroke-[#6243FA]' />
                            </div>
                            <div class="inline-flex items-center justify-center gap-[5px] p-[11px] relative flex-[0_0_auto] bg-white rounded-[30px] overflow-hidden border border-solid border-[#6243fa]">
                                <Share color='#6243FA' size={14} variant="Outline" className='stroke-[#6243FA]' />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inline-flex items-center gap-[20px] px-[10px] py-[30px] relative flex-[0_0_auto]">
                    <div class="inline-flex flex-col items-center justify-center gap-[9px] p-[10px] relative flex-[0_0_auto]">
                        <div class="inline-flex items-center gap-[6px] relative flex-[0_0_auto]">
                            <BoxTick color="#B9AEC5" variant="Outline" size={18} className='stroke-[#B9AEC5] stroke-[.5px]' />
                            <div class="[font-family:'Noto_Sans',Helvetica] font-semibold text-[#005947] text-[18px] relative w-fit tracking-[0] leading-[normal] whitespace-nowrap">
                                121
                            </div>
                        </div>
                        <div class="relative w-fit [font-family:'Frederik-Regular',Helvetica] font-normal text-[#009a7b] text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                            Total Sales
                        </div>
                    </div>
                    <img class="relative self-stretch w-px object-cover" alt="Line" src="https://c.animaapp.com/2pP7niVX/img/line-16.svg" />
                    <div class="inline-flex flex-col items-center justify-center gap-[9px] p-[10px] relative flex-[0_0_auto]">
                        <div class="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                            <Star1 color='#F7C317' size={18} className='fill-[#F7C317]' />
                            <div class="relative self-stretch w-[25px] mt-[-1.00px] font-bold text-[#005947] text-[18px] tracking-[0] leading-[normal] whitespace-nowrap">
                                4.7
                            </div>
                        </div>
                        <div class="relative w-fit [font-family:'Frederik-Regular',Helvetica] font-normal text-[#009a7b] text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                            Rating &amp; Reviews
                        </div>
                    </div>
                </div>
            </div>
            <Tabs
                data={dataTabs}
                tabContentWrapperClassName='!p-0'
                hasContent
            />
        </div>
    )
}

export default SellerPage;