import React from 'react';
import SellerReviewItem from '../SellerReviewItem';
import Pagination from '../Pagination';
import { Star1 } from 'iconsax-react';
import { useSellerReview } from '@riosst100/pwa-marketplace/src/talons/SellerReview/useSellerReview';

// Dummy reviews data
const dummyReviews = {
    __typename: 'SellerRates',
    total_count: 2,
    items: [
        {
            __typename: 'SellerRate',
            id: 1,
            name: 'John Doe',
            date: '18 January 2024',
            rating: 5,
            comment: 'Got item at a great price. Arrived way quicker than expected, extremely well packaged and exactly as described. Highly recommend the seller.'
        },
        {
            __typename: 'SellerRate',
            id: 2,
            name: 'Roger Taylor',
            date: '25 January 2024',
            rating: 2,
            comment: 'Got item at a great price. Arrived way quicker than expected, extremely well packaged and exactly as described. Highly recommend the seller.'
        }
    ],
    page_info: {
        __typename: 'SearchResultPageInfo',
        total_pages: 1,
        page_size: 10,
        current_page: 1,
        total_count: 2
    }
};

const SellerReview = ({ seller }) => {
    // const talonProps = useSellerReview({
    //     sellerUrl: seller.url_key
    // });
    // const { reviews, loading } = talonProps;
    
    const reviews = dummyReviews;

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

    return (
        <>
            <div className='w-full'>
                <div>
                    <h2 className="text-xl font-bold mb-4">Buyer Reviews</h2>
                </div>
                
                <div className='w-full flex items-start xs_flex-col lg_flex-row gap-[30px]'>
                    <div className="w-full xs_max-w-full lg_max-w-[365px] border border-[#E6E9EA] rounded-md p-6">
                        <div className="flex justify-between items-start mb-1">
                            {/* Left - Star rating */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-4 h-4">
                                            <Star1 
                                                color={i < 4 ? '#F7C317' : '#D9D9D9'} 
                                                size={16} 
                                                className={i < 4 ? 'fill-[#F7C317]' : ''}
                                            />
                                        </div>
                                    ))}
                                    <span className="ml-1 font-medium text-sm">4.5 out of 5</span>
                                </div>
                                <div className="text-xs text-gray-600">100% Positive Rating (2 Ratings)</div>
                            </div>
                            <div>
                                <select className="border border-[#E6E9EA] rounded px-2 py-1 text-xs">
                                    <option>12 month</option>
                                    <option>6 month</option>
                                    <option>3 month</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Rating Bars */}
                        <div className="mt-4">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = starCounts[star] || 0;
                                const percentage = reviews.total_count ? Math.round((count / reviews.total_count) * 100) : 0;
                                
                                return (
                                    <div key={star} className="flex items-center mb-2">
                                        {/* Star number */}
                                        <div className="flex items-center mr-2">
                                            <Star1 color="#F7C317" size={14} className="fill-[#F7C317]" />
                                            <span className="text-sm ml-1">{star}</span>
                                        </div>
                                        
                                        {/* Progress bar */}
                                        <div className="relative h-[8px] flex-1 bg-[#E4EBF5] rounded-sm mr-2">
                                            <div 
                                                className="absolute h-[8px] bg-[#FF7A00] rounded-sm" 
                                                style={{width: `${percentage}%`}}
                                            />
                                        </div>
                                        
                                        {/* Percentage */}
                                        <span className="text-sm text-right">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Right Column - Reviews */}
                    <div className="flex-1">
                        {/* Filter */}
                        <div className="flex items-center mb-6">
                            <span className="font-medium mr-3">Filter By</span>
                            <select className="border border-[#E6E9EA] rounded px-3 py-2 text-sm">
                                <option>All Stars</option>
                                <option>5 Stars</option>
                                <option>4 Stars</option>
                                <option>3 Stars</option>
                                <option>2 Stars</option>
                                <option>1 Stars</option>
                            </select>
                        </div>
                        
                        {/* Reviews List */}
                        <div className="space-y-4 mb-6">
                            {reviews && reviews.items && reviews.items.map((review, index) => (
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
                                    
                                    {/* Star Rating */}
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
                                    
                                    {/* Review Text */}
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination */}
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
                </div>
            </div>
        </>
    );
};

export default SellerReview;