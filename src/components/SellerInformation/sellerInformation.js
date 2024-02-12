import React from 'react';
import SellerLocation from '../SellerLocation';
import { Location, ShopAdd } from 'iconsax-react';

const SellerInformation = () => {
    return (
        <>
            <div class="flex flex-col items-start gap-[30px] px-[10px]">
                <div class="flex items-start justify-between relative flex-1 self-stretch w-full grow">
                    <div class="flex flex-col w-[320px] items-start gap-[30px] relative self-stretch">
                        <div class="flex flex-col items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                            <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-DemiBold',Helvetica] font-bold text-[#1b1b1b] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">Description</div>
                            <div class="inline-flex items-center justify-center gap-[10px] relative flex-[0_0_auto]">
                                <p class="relative w-[300px] mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[16px]">
                                    Zen Market was established in 12003 and has grown over the years to be the largest hobby store.<br />
                                    <br />
                                    +6556754325
                                </p>
                            </div>
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <Location color="#009A7B" size={18} variant="Outline" className='stroke-[#009A7B] stroke-[0.5px]' />
                                <p class="relative w-fit [font-family:'Frederik-Regular',Helvetica] font-normal text-[#009a7b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">612, Jurong West Street 65</p>
                            </div>
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <ShopAdd color="#009A7B" size={18} variant="Outline" className='stroke-[#009A7B] stroke-[0.5px]' />
                                <div class="relative self-stretch w-[151px] mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#009a7b] text-[14px] tracking-[0] leading-[normal]">Joined: December 2023</div>
                            </div>
                        </div>
                    </div>
                    <img class="relative self-stretch w-px object-cover" alt="Line" src="https://c.animaapp.com/cafLsvev/img/line-22.svg" />
                    <div class="flex flex-col w-[320px] items-start gap-[30px] relative">
                        <div class="flex flex-col items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                            <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-DemiBold',Helvetica] font-bold text-[#1b1b1b] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">Working Hour</div>
                            <div class="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                <div class="inline-flex items-start gap-[10px] relative flex-[0_0_auto]">
                                    <p class="relative w-[186px] mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal]">
                                        Monday - Friday 9 AM - 5 PM<br />
                                        <br />
                                        Saturday 11 AM - 3 PM<br />
                                        <br />
                                        Sunday Close
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img class="relative self-stretch w-px object-cover" alt="Line" src="https://c.animaapp.com/cafLsvev/img/line-22.svg" />
                    <div class="flex flex-col w-[320px] items-start gap-[15px] relative">
                        <div class="inline-flex items-start gap-[10px] px-[10px] py-0 relative flex-[0_0_auto]">
                            <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-DemiBold',Helvetica] font-bold text-[#1b1b1b] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">Ship To</div>
                        </div>
                        <div class="flex flex-wrap w-[300px] items-start gap-[10px_10px] relative flex-[0_0_auto]">
                            <div class="flex flex-wrap items-center gap-[0px_10px] px-0 py-[5px] relative flex-1 grow">
                                <div class="inline-flex items-center justify-center gap-[10px] px-[10px] py-0 relative flex-[0_0_auto] border-r [border-right-style:solid] border-[#e6e9ea]">
                                    <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Yishun</div>
                                </div>
                                <div class="inline-flex items-center justify-center gap-[10px] px-[10px] py-0 relative flex-[0_0_auto] border-r [border-right-style:solid] border-[#e6e9ea]">
                                    <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Jurong West</div>
                                </div>
                                <div class="inline-flex items-center justify-center gap-[10px] px-[10px] py-0 relative flex-[0_0_auto] border-r [border-right-style:solid] border-[#e6e9ea]">
                                    <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Jurong East</div>
                                </div>
                                <div class="inline-flex items-center justify-center gap-[10px] px-[10px] py-0 relative flex-[0_0_auto] border-r [border-right-style:solid] border-[#e6e9ea]">
                                    <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Seletar</div>
                                </div>
                                <div class="inline-flex items-center justify-center gap-[10px] px-[10px] py-0 relative flex-[0_0_auto] border-r [border-right-style:solid] border-[#e6e9ea]">
                                    <div class="mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] text-[#1b1b1b] text-[14px] leading-[normal] whitespace-nowrap relative w-fit font-normal tracking-[0]">Serangoon</div>
                                </div>
                                <div class="inline-flex items-center justify-center gap-[10px] px-[10px] py-0 relative flex-[0_0_auto]">
                                    <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Bukit Batok</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-start relative self-stretch w-full flex-[0_0_auto]">
                    <div class="flex flex-col items-start gap-[15px] relative flex-1 grow">
                        <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-DemiBold',Helvetica] font-bold text-[#1b1b1b] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">Terms &amp; Condition</div>
                        <div class="inline-flex items-center justify-center gap-[10px] relative flex-[0_0_auto]">
                            <div class="flex flex-col w-[500px] items-start gap-[2px]">
                                <p class="relative self-stretch [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal]">
                                    <span class="[font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0]">- Delivery is made on the same day the order is received<br /></span>
                                </p>
                                <p class="relative self-stretch [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal]">
                                    <span class="[font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0]"><br /></span>
                                </p>
                                <p class="relative self-stretch [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal]">
                                    <span class="[font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0]">- Maximum until 5 PM<br /></span>
                                </p>
                                <p class="relative self-stretch [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal]">
                                    <span class="[font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0]"><br /></span>
                                </p>
                                <p class="relative self-stretch [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal]">
                                    <span class="[font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0]">- Orders received after 17.00 WIB will be delivered the next day<br /></span>
                                </p>
                                <p class="relative self-stretch [font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0] leading-[normal]">
                                    <span class="[font-family:'Frederik-Regular',Helvetica] font-normal text-[#1b1b1b] text-[14px] tracking-[0]"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <SellerLocation />
            </div>
        </>
    )
}

export default SellerInformation;