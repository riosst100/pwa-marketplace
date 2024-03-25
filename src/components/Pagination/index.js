import React from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

const Pagination = ({ totalPages, currentPage, pageSize }) => {

    const pageNumbers = [];

    // Populate the items array with numbers from 1 to maxNumber
    if (totalPages) {
        for (let i = 1; i < totalPages+1; i++) {
            pageNumbers.push(i);
        }
    }

    const activeClass = "inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] bg-[#6243fa] rounded-[5px] border border-solid border-[#6243fa]";
    const bgClass = "inline-flex flex-col items-center justify-center gap-[10px] px-[15px] py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]";

    const activeTextClass = "relative w-fit font-normal text-white text-[14px] tracking-[0] leading-none whitespace-nowrap";
    const textClass = "relative w-fit font-normal text-[#6243fa] text-[14px] tracking-[0] leading-none whitespace-nowrap";

    return (
        <>
            <div className={'inline-flex items-start gap-[10px] relative'}>
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-3 py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[14px] tracking-[0] leading-none whitespace-nowrap">
                        <ArrowLeft2 size="16" color="#6243fa" variant="Outline" />
                    </div>
                </button>
                {pageNumbers ? pageNumbers.map((num, index) => (
                    <span key={index}>
                        <button className={num == currentPage ? activeClass : bgClass}>
                            <div className={num == currentPage ? activeTextClass : textClass}>
                                {num}
                            </div>
                        </button>
                    </span>
                )) : ''}
                <button className="inline-flex flex-col items-center justify-center gap-[10px] px-3 py-[10px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-[#e6e9ea]">
                    <div className="relative w-fit font-normal text-[#6243fa] text-[14px] tracking-[0] leading-none whitespace-nowrap">
                        <ArrowRight2 size="16" color="#6243fa" variant="Outline" />
                    </div>
                </button>
            </div>
        </>
    )
}

export default Pagination;