import React from 'react';
import SellerReviewItem from '../SellerReviewItem';
import Pagination from '../Pagination';
import { Star1 } from 'iconsax-react';
import { useSellerReview } from '@riosst100/pwa-marketplace/src/talons/SellerReview/useSellerReview';

const SellerReview = ({ seller }) => {
    const talonProps = useSellerReview({
        sellerUrl: seller.url_key
    });

    const { reviews, loading } = talonProps;

    return (
        <>
            <div className='w-full flex items-start xs_flex-col lg_flex-row gap-[30px] '>
                <div className="w-full xs_max-w-full lg_max-w-[300px] px-[25px] py-10 rounded-md border border-gray-200 flex-col justify-start items-start gap-[25px] inline-flex">
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
                            <div className="text-center text-zinc-900 text-sm font-normal leading-[18px]">({reviews ? reviews.items.length : 0} Reviews)</div>
                        </div>
                    </div>
                    <div className="w-full flex-col items-start gap-2 flex">
                        <div className="flex xs_w-full lg_w-fit gap-3 items-center">
                            <div className="gap-2.5 flex items-center xs_w-full lg_w-fit">
                                <div className="gap-[5px] flex items-center">
                                    <div className="w-3.5 h-3.5 relative">
                                        <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    </div>
                                    <div className="gap-2.5 flex">
                                        <div className="text-center text-zinc-900 text-sm font-normal leading-[18px]">5</div>
                                    </div>
                                </div>
                                <div className="xs_w-full lg_w-40 h-[6px] relative">
                                    <div className="w-full h-[6px] absolute bg-[#E4EBF5] rounded" />
                                    <div className="w-full h-[6px] absolute bg-[#4E31DB] rounded" />
                                </div>
                            </div>
                            <div className="w-10 text-zinc-900 text-sm font-normal leading-[18px]">12</div>
                        </div>
                        <div className="flex xs_w-full lg_w-fit gap-3 items-center">
                            <div className="gap-2.5 flex items-center xs_w-full lg_w-fit">
                                <div className="gap-[5px] flex items-center">
                                    <div className="w-3.5 h-3.5 relative">
                                        <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    </div>
                                    <div className="gap-2.5 flex">
                                        <div className="text-center text-zinc-900 text-sm font-normal leading-[18px]">4</div>
                                    </div>
                                </div>
                                <div className="xs_w-full lg_w-40 h-[6px] relative">
                                    <div className="w-full h-[6px] absolute bg-[#E4EBF5] rounded" />
                                    <div className="w-[80%] h-[6px] absolute bg-[#4E31DB] rounded" />
                                </div>
                            </div>
                            <div className="w-10 text-zinc-900 text-sm font-normal leading-[18px]">8</div>
                        </div>
                        <div className="flex xs_w-full lg_w-fit gap-3 items-center">
                            <div className="gap-2.5 flex items-center xs_w-full lg_w-fit">
                                <div className="gap-[5px] flex items-center">
                                    <div className="w-3.5 h-3.5 relative">
                                        <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    </div>
                                    <div className="gap-2.5 flex">
                                        <div className="text-center text-zinc-900 text-sm font-normal leading-[18px]">3</div>
                                    </div>
                                </div>
                                <div className="xs_w-full lg_w-40 h-[6px] relative">
                                    <div className="w-full h-[6px] absolute bg-[#E4EBF5] rounded" />
                                    <div className="w-[45%] h-[6px] absolute bg-[#4E31DB] rounded" />
                                </div>
                            </div>
                            <div className="w-10 text-zinc-900 text-sm font-normal leading-[18px]">5</div>
                        </div>
                        <div className="flex xs_w-full lg_w-fit gap-3 items-center">
                            <div className="gap-2.5 flex items-center xs_w-full lg_w-fit">
                                <div className="gap-[5px] flex items-center">
                                    <div className="w-3.5 h-3.5 relative">
                                        <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    </div>
                                    <div className="gap-2.5 flex">
                                        <div className="text-center text-zinc-900 text-sm font-normal leading-[18px]">2</div>
                                    </div>
                                </div>
                                <div className="xs_w-full lg_w-40 h-[6px] relative">
                                    <div className="w-full h-[6px] absolute bg-[#E4EBF5] rounded" />
                                    <div className="w-[1%] h-[6px] absolute bg-[#4E31DB] rounded" />
                                </div>
                            </div>
                            <div className="w-10 text-zinc-900 text-sm font-normal leading-[18px]">1</div>
                        </div>
                        <div className="flex xs_w-full lg_w-fit gap-3 items-center">
                            <div className="gap-2.5 flex items-center xs_w-full lg_w-fit">
                                <div className="gap-[5px] flex items-center">
                                    <div className="w-3.5 h-3.5 relative">
                                        <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' />
                                    </div>
                                    <div className="gap-2.5 flex">
                                        <div className="text-center text-zinc-900 text-sm font-normal leading-[18px]">1</div>
                                    </div>
                                </div>
                                <div className="xs_w-full lg_w-40 h-[6px] relative">
                                    <div className="w-full h-[6px] absolute bg-[#E4EBF5] rounded" />
                                    <div className="w-[0%] h-[6px] absolute bg-[#4E31DB] rounded" />
                                </div>
                            </div>
                            <div className="w-10 text-zinc-900 text-sm font-normal leading-[18px]">0</div>
                        </div>
                    </div>
                    <div className="xs_self-end lg_self-stretch px-[30px] py-2.5 bg-white rounded-[30px] border border-indigo-600 justify-center items-center gap-2.5 inline-flex">
                        <div className="text-indigo-600 text-base font-medium leading-tight">Write a review</div>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex flex-col w-full items-start gap-[20px] relative mb-[30px]'>
                        <SellerReviews reviews={reviews} />
                    </div>
                    <div className='pagination-container w-full flex justify-center'>
                        {reviews && reviews.page_info ? <Pagination 
                        currentPage={reviews.page_info.current_page} 
                        totalPages={reviews.page_info.total_pages} 
                        pageSize={reviews.page_info.page_size} /> : ''}
                    </div>
                </div>
            </div>
        </>
    )
}

const SellerReviews = ({ reviews }) => {
    return reviews && reviews.items.length ? reviews.items.map((review, index) => <SellerReviewItem review={review} key={index} /> ) : ''
}

export default SellerReview;