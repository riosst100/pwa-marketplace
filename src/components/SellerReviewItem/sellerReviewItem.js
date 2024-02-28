import React from 'react';
import { Star1 } from 'iconsax-react';

const SellerReviewItem = ({ review }) => {
    const rate1 = [];
    if (review.rate1) {
        for (let i = 1; i < review.rate1+1; i++) {
            rate1.push({
                'num': i,
                'star': true
            });
        }

        if (review.rate1 < 5) {
            for (let i = review.rate1+1; i < 5+1; i++) {
                rate1.push({
                    'num': i,
                    'star': false
                });
            }
        }
    }

    const rate2 = [];
    if (review.rate2) {
        for (let i = 1; i < review.rate2+1; i++) {
            rate2.push({
                'num': i,
                'star': true
            });
        }

        if (review.rate2 < 5) {
            for (let i = review.rate2+1; i < 5+1; i++) {
                rate2.push({
                    'num': i,
                    'star': false
                });
            }
        }
    }

    const rate3 = [];
    if (review.rate3) {
        for (let i = 1; i < review.rate3+1; i++) {
            rate3.push({
                'num': i,
                'star': true
            });
        }

        if (review.rate3 < 5) {
            for (let i = review.rate3+1; i < 5+1; i++) {
                rate3.push({
                    'num': i,
                    'star': false
                });
            }
        }
    }

    const formatDate = (date) => {
        const isoFormattedDate = date.replace(' ', 'T');
        const formattedDate = new Date(isoFormattedDate).toLocaleDateString(
            undefined,
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );

        return formattedDate;
    }

    const getInitialName = (name) => {
        let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

        let initials = [...name.matchAll(rgx)] || [];

        initials = (
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
        ).toUpperCase();

        return initials;
    }

    return (
        <>
            <div class="flex flex-col items-start gap-[10px] p-[25px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[6px] border border-solid border-[#e6e9ea]">
                <div class="flex flex-col items-start gap-[20px] relative self-stretch w-full flex-[0_0_auto]">
                    <div class="inline-flex flex-col items-start gap-[10px] relative flex-[0_0_auto]">
                        <div class="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                            <div class="flex w-[40px] h-[40px] items-center justify-around gap-[10px] p-[10px] relative bg-[#4e31db] rounded-[30px]">
                                <div class="relative w-fit font-semibold text-white text-[16px] text-center tracking-[0] leading-[18px] whitespace-nowrap">
                                    {review ? getInitialName(review.nickname) : ''}
                                </div>
                            </div>
                            <div class="inline-flex flex-col items-start gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-fit mt-[-1.00px] font-medium text-[14px] text-center tracking-[0] leading-[18px] whitespace-nowrap">
                                    {review ? review.nickname : ''}
                                </div>
                                <div class="relative w-fit font-medium text-[#999999] text-[12px] text-center tracking-[0] leading-[18px] whitespace-nowrap">       
                                    {review ? formatDate(review.created_at) : ''}
                                </div>
                            </div>
                        </div>
                        <div class="flex xs_flex-col sm_flex-row items-start xs_gap-1 sm_gap-[20px] relative flex-[0_0_auto]">
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-fit font-normal text-[14px] tracking-[0] leading-[18px] whitespace-nowrap">Price</div>
                                <div class="inline-flex items-start gap-[6px] relative flex-[0_0_auto]">
                                    <ReviewRating rate={rate1} />
                                </div>
                            </div>
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-[37px] font-normal text-[14px] tracking-[0] leading-[18px]">Value</div>
                                <div class="inline-flex items-start gap-[6px] relative flex-[0_0_auto]">
                                    <ReviewRating rate={rate2} />
                                </div>
                            </div>
                            <div class="inline-flex items-center gap-[10px] relative flex-[0_0_auto]">
                                <div class="relative w-fit font-normal text-[14px] tracking-[0] leading-[18px] whitespace-nowrap">Quality</div>
                                <div class="inline-flex items-start gap-[6px] relative flex-[0_0_auto]">
                                    <ReviewRating rate={rate3} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="relative self-stretch font-normal text-[14px] tracking-[0] leading-[18px]">
                        {review ? review.detail : ''}
                    </p>
                </div>
            </div>
        </>
    )
}

const ReviewRating = ({ rate }) => {
    return rate && rate.length ? rate.map((rating, index) => <RatingStar star={rating.star} />) : '';
}

const RatingStar = ({ star }) => {
    return star ? <Star1 color='#F7C317' size={14} className='fill-[#F7C317]' /> : <Star1 color='#D9D9D9' size={14} className='fill-[#D9D9D9]' />;
}

export default SellerReviewItem;