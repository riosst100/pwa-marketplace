import React from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

const Pagination = () => {
    return (
        <>
            <div className={'inline-flex items-start gap-[10px] relative'}>
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-3 py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[16px] tracking-[0] leading-none whitespace-nowrap">
                        <ArrowLeft2 size="16" color="#6243fa" variant="Outline" />
                    </div>
                </button>
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[16px] tracking-[0] leading-none whitespace-nowrap">
                        1
                    </div>
                </button>
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[16px] tracking-[0] leading-none whitespace-nowrap">
                        2
                    </div>
                </button>
                <button
                    className={'inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] bg-[#6243fa] rounded-[5px] border border-solid border-[#6243fa]'}
                >
                    <div className="relative w-fit font-normal text-white text-[16px] tracking-[0] leading-none whitespace-nowrap">
                        3
                    </div>
                </button>
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[16px] tracking-[0] leading-none whitespace-nowrap">
                        4
                    </div>
                </button>
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[16px] tracking-[0] leading-none whitespace-nowrap">
                        5
                    </div>
                </button>
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-3 py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[16px] tracking-[0] leading-none whitespace-nowrap">
                        <ArrowRight2 size="16" color="#6243fa" variant="Outline" />
                    </div>
                </button>
            </div>
        </>
    )
}

export default Pagination