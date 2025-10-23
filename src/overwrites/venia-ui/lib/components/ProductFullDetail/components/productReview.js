import React, { useState } from 'react'
import Review from '@riosst100/pwa-marketplace/src/components/ProductReviewItem';
import { Star1 } from 'iconsax-react';
import Button from '../../Button';
import ModalFormReview from './modalFormReview';

const productReview = (props) => {

    const { className } = props;
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('All');


    // Dummy reviews data
    const dummyReviews = {
        __typename: 'ProductRates',
        total_count: 6,
        items: [
            {
                __typename: 'ProductRate',
                id: 1,
                name: 'John Doe',
                date: '18 January 2024',
                rating: 5,
                comment: 'Got item at a great price. Arrived way quicker than expected, extremely well packaged and exactly as described. Highly recommend the seller.'
            },
            {
                __typename: 'ProductRate',
                id: 2,
                name: 'Roger Taylor',
                date: '25 January 2024',
                rating: 2,
                comment: 'Arrived late and packaging was damaged. Not satisfied.'
            },
            {
                __typename: 'ProductRate',
                id: 3,
                name: 'Sarah Smith',
                date: '02 February 2024',
                rating: 4,
                comment: 'Good product, but delivery could be faster.'
            },
            {
                __typename: 'ProductRate',
                id: 4,
                name: 'Michael Johnson',
                date: '10 February 2024',
                rating: 3,
                comment: 'Average experience, item as described but nothing special.'
            },
            {
                __typename: 'ProductRate',
                id: 5,
                name: 'Emily Davis',
                date: '15 February 2024',
                rating: 5,
                comment: 'Excellent service and product quality! Will buy again.'
            },
            {
                __typename: 'ProductRate',
                id: 6,
                name: 'David Lee',
                date: '20 February 2024',
                rating: 1,
                comment: 'Item not as described. Very disappointed.'
            }
        ],
        page_info: {
            __typename: 'SearchResultPageInfo',
            total_pages: 1,
            page_size: 10,
            current_page: 1,
            total_count: 6
        }
    };


    const totalReviews = dummyReviews.items.length;
    const averageRating = totalReviews > 0
        ? (dummyReviews.items.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1)
        : 0;

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    dummyReviews.items.forEach(item => {
        if (starCounts[item.rating] !== undefined) {
            starCounts[item.rating]++;
        }
    });

    const getPercent = (count) => totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    
    const filteredReviews = filter === 'All'
        ? dummyReviews.items
        : dummyReviews.items.filter(item => item.rating === parseInt(filter));

    return (
        <>
            <ModalFormReview open={open} setOpen={setOpen} />
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
                                ...dummyReviews,
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