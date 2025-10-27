import React, { useState } from 'react';
import Pagination from '../Pagination';
import { Star1 } from 'iconsax-react';

const ProductReviewItem = ({ reviews }) => {

    // count stars
    const getStarCounts = () => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        if (reviews && reviews.items) {
            reviews.items.forEach(item => {
                if (counts[item.rating] !== undefined) {
                    counts[item.rating]++;
                }
            });
        }
        return counts;
    };
    const starCounts = getStarCounts();

    const displayedReviews = reviews && reviews.items ? reviews.items : [];

    return (
        <>
            <div className="flex-1">
                <div className="space-y-4 mb-6">
                    {displayedReviews.map((review, index) => (
                        <div key={index} className="border border-[#E6E9EA] rounded-md p-4">
                            <div className="flex items-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mr-3">
                                    Pict
                                </div>
                                <div>
                                    <div className="font-medium">{review.name}</div>
                                    <div className="text-gray-500 text-sm">{review.date}</div>
                                </div>
                            </div>

                            <div className="flex mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star1 
                                        key={i}
                                        color={i < review.rating ? '#F7C317' : '#D9D9D9'} 
                                        size={16} 
                                        className={i < review.rating ? 'fill-[#F7C317]' : ''}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    {reviews && reviews.page_info && reviews.page_info.total_pages > 0 && (
                        <Pagination
                            currentPage={reviews.page_info.current_page}
                            totalPages={reviews.page_info.total_pages}
                            pageSize={reviews.page_info.page_size}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default ProductReviewItem;