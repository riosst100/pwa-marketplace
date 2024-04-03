import React, { useState } from 'react'
import Review from '@riosst100/pwa-marketplace/src/components/SellerReviewItem';
import { Star1 } from 'iconsax-react';
import Button from '../../Button';
import ModalFormReview from './modalFormReview';

const productReview = (props) => {

    const { className } = props;

    const [open, setOpen] = useState(false);

    return (
        <>
            <ModalFormReview open={open} setOpen={setOpen} />
            <div className={className}>
                <div className='review-summary flex justify-between mb-[30px] pb-[30px] border-b border-gray-100'>
                    <div className="justify-start items-end gap-[15px] inline-flex">
                        <div className="text-center text-zinc-900 text-[40px] font-semibold leading-10">4.7</div>
                        <div className="flex-col justify-start items-start gap-[9px] inline-flex">
                            <div className="justify-start items-start gap-1.5 inline-flex">
                                <div className="w-3.5 h-3.5 relative">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                </div>
                                <div className="w-3.5 h-3.5 relative">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                </div>
                                <div className="w-3.5 h-3.5 relative">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                </div>
                                <div className="w-3.5 h-3.5 relative">
                                    <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                </div>
                                <div className="w-3.5 h-3.5 relative">
                                    <Star1 color='#D9D9D9' size={14} className='fill-[#D9D9D9]' />
                                </div>
                            </div>
                            <div className="text-center text-zinc-900 text-sm font-normal leading-[18px]">(26 Reviews)</div>
                        </div>
                    </div>
                    <Button
                        priority='low'
                        classes={{
                            content: 'normal-case font-normal text-base'
                        }}
                        onClick={() => setOpen(true)}
                    >
                        Write a review
                    </Button>
                </div>
                <div className='review-list flex flex-col gap-y-4'>
                    <Review />
                    <Review />
                    <Review />
                    <Review />
                    <Review />
                </div>
            </div>
        </>
    )
}

export default productReview