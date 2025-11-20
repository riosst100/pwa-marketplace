import React, { useState } from 'react'
import Review from '@riosst100/pwa-marketplace/src/components/ProductReviewItem';
import { Star1 } from 'iconsax-react';
import Button from '../../Button';
import ModalFormReview from './modalFormReview';



const productReview = (props) => {
    const {
        className,
        productReviewData,
        loadingProductReview,
        errorProductReview,
        ratingsMetadataData,
        loadingRatingsMetadata,
        handleSubmitReview,
        defaultNickname,
        product
    } = props;

    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('All');
    const [submitting, setSubmitting] = useState(false);

    let reviewsData = null;
    if (
        productReviewData &&
        productReviewData.products &&
        productReviewData.products.items &&
        productReviewData.products.items.length > 0
    ) {
        const item = productReviewData.products.items[0];
        const reviewItems = (item.reviews && item.reviews.items) || [];
        reviewsData = {
            __typename: 'ProductRates',
            total_count: item.review_count || reviewItems.length,
            items: reviewItems.map((r, idx) => ({
                __typename: 'ProductRate',
                id: idx + 1,
                name: r.nickname,
                date: r.created_at,
                rating: r.average_rating ? Math.round(r.average_rating / 20) : (r.ratings_breakdown && r.ratings_breakdown[0] ? parseInt(r.ratings_breakdown[0].value) : 0),
                comment: r.text || r.summary || '',
                summary: r.summary || '',
                productName: r.product?.name || '',
                ratings_breakdown: r.ratings_breakdown || []
            })),
            page_info: productReviewData.products.page_info || {
                total_pages: 1,
                current_page: 1
            }
        };
    }

    if (!reviewsData || !reviewsData.items.length) {
        return (
            <>
                <ModalFormReview
                    open={open}
                    setOpen={setOpen}
                    defaultNickname={defaultNickname}
                    ratingsMetadata={ratingsMetadataData?.productReviewRatingsMetadata?.items || []}
                    loadingRatingsMetadata={loadingRatingsMetadata}
                    onSubmit={async (formValues) => {
                        setSubmitting(true);
                        const input = {
                            nickname: formValues.nickname,
                            summary: formValues.summary,
                            text: formValues.review,
                            sku: product?.sku,
                            ratings: formValues.ratings
                        };
                        const result = await handleSubmitReview(input);
                        setSubmitting(false);
                        if (result.success) setOpen(false);
                    }}
                    submitting={submitting}
                />
                <div className={className}>
                    <div className="flex items-center justify-between mb-6">
                        <div />
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
                    <div className="text-center py-8 text-gray-500">No reviews yet.</div>
                </div>
            </>
        );
    }

    const totalReviews = reviewsData.items.length;
    const averageRating = totalReviews > 0
        ? (reviewsData.items.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1)
        : 0;

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.items.forEach(item => {
        if (starCounts[item.rating] !== undefined) {
            starCounts[item.rating]++;
        }
    });

    const getPercent = (count) => totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

    const filteredReviews = filter === 'All'
        ? reviewsData.items
        : reviewsData.items.filter(item => item.rating === parseInt(filter));

    return (
        <>
            <ModalFormReview
                open={open}
                setOpen={setOpen}
                defaultNickname={defaultNickname}
                ratingsMetadata={ratingsMetadataData?.productReviewRatingsMetadata?.items || []}
                loadingRatingsMetadata={loadingRatingsMetadata}
                onSubmit={async (formValues) => {
                    setSubmitting(true);
                    const input = {
                        nickname: formValues.nickname,
                        summary: formValues.summary,
                        text: formValues.review,
                        sku: product?.sku,
                        ratings: formValues.ratings
                    };
                    const result = await handleSubmitReview(input);
                    setSubmitting(false);
                    if (result.success) setOpen(false);
                }}
                submitting={submitting}
            />
            <div className={className}>
                <div className="w-full flex items-start xs_flex-col lg_flex-row gap-[30px]">
                    <div className="w-full xs_max-w-full lg_max-w-[365px] border border-[#E6E9EA] rounded-md p-6">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-4 h-4">
                                            <Star1 
                                                color={i < Math.round(averageRating) ? '#F7C317' : '#D9D9D9'} 
                                                size={16} 
                                                className={i < Math.round(averageRating) ? 'fill-[#F7C317]' : ''}
                                            />
                                        </div>
                                    ))}
                                    <span className="ml-1 font-medium text-sm">{averageRating} out of 5</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = starCounts[star] || 0;
                                const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                                return (
                                    <div key={star} className="flex items-center mb-2">
                                        <div className="flex items-center mr-2">
                                            <Star1 color="#F7C317" size={14} className="fill-[#F7C317]" />
                                            <span className="text-sm ml-1">{star}</span>
                                        </div>
                                        <div className="relative h-[8px] flex-1 bg-[#E4EBF5] rounded-sm mr-2">
                                            <div 
                                                className="absolute h-[8px] bg-[#FF7A00] rounded-sm" 
                                                style={{width: `${percentage}%`}}
                                            />
                                        </div>
                                        <span className="text-sm text-right">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <span className="font-medium mr-3">Filter By</span>
                                <select
                                    className="border border-[#E6E9EA] rounded px-3 py-2 text-sm"
                                    value={filter}
                                    onChange={e => setFilter(e.target.value)}
                                >
                                    <option value="All">All Stars</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Stars</option>
                                </select>
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
                        {/* Reviews List */}
                        <div className='space-y-4 mb-6'>
                            <Review reviews={{
                                ...reviewsData,
                                items: filteredReviews
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default productReview