import React from 'react';

const Pagination = () => {
    return (
        <>
            <div className={'inline-flex items-start gap-[10px] relative'}>
                <svg class="!relative !flex-[0_0_auto]" fill="none" height="32" viewBox="0 0 40 32" width="40" xmlns="http://www.w3.org/2000/svg"><rect height="31" rx="4.5" stroke="#E6E9EA" width="39" x="0.5" y="0.5"></rect><path d="M21.75 20.62L17.9466 16.8167C17.4974 16.3675 17.4974 15.6325 17.9466 15.1833L21.75 11.38" stroke="#6243FA" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"></path></svg>
                <div className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#6243fa] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
                        1
                    </div>
                </div>
                <div className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#6243fa] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
                        2
                    </div>
                </div>
                <div
                    className={'inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] bg-[#6243fa] rounded-[5px] border border-solid border-[#6243fa]'}
                >
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-white text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
                        3
                    </div>
                </div>
                <div className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#6243fa] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
                        4
                    </div>
                </div>
                <div className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#6243fa] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
                        5
                    </div>
                </div>
                <svg class="!relative !flex-[0_0_auto]" fill="none" height="32" viewBox="0 0 40 32" width="40" xmlns="http://www.w3.org/2000/svg"><rect height="31" rx="4.5" stroke="#E6E9EA" width="39" x="0.5" y="0.5"></rect><path d="M18.1975 20.62L22.0008 16.8166C22.45 16.3675 22.45 15.6325 22.0008 15.1833L18.1975 11.38" stroke="#6243FA" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"></path></svg>
            </div>
        </>
    )
}

export default Pagination