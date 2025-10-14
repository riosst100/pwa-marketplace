import React, { Fragment, Suspense, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSeller } from '@riosst100/pwa-marketplace/src/talons/Seller/useSeller';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import mapSeller from '@riosst100/pwa-marketplace/src/util/mapSeller';
import Slider from '@riosst100/pwa-marketplace/src/components/commons/Slider';
import Tabs from '@riosst100/pwa-marketplace/src/components/commons/Tabs';
import SellerProducts from '../SellerProducts';
import SellerInformation from '../SellerInformation';
import Reviews from '../SellerReview';
import {
    Verify,
    Sms,
    Message,
    Heart,
    Share,
    BoxTick,
    Star1,
    Shop,
} from 'iconsax-react';
import Image from '@magento/venia-ui/lib/components/Image';
import Button from '@magento/venia-ui/lib/components/Button';
import cn from 'classnames';
import Rating from '@riosst100/pwa-marketplace/src/components/commons/Rating';

const FavoriteSellerButton = React.lazy(() => import('@riosst100/pwa-marketplace/src/components/FavoriteSeller/AddToListButton'));


import { useHistory } from 'react-router-dom';

const SellerDetail = props => {
    const talonProps = useSeller({
        mapSeller
    });

    const { error, loading, seller, favoriteSellerButtonProps } = talonProps;
    const history = useHistory();

    if (loading && !seller)
        return '';
    
    if (error && !seller) return <ErrorView />;
    if (!seller) {
        return (
            <h1>
                <FormattedMessage
                    id={'seller.notFound'}
                    defaultMessage={
                        'Seller Not Found.'
                    }
                />
            </h1>
        );
    }

    const dummyRating = {
        rating_summary: {
            average_rating_percent: 70, 
            positive_percentage: 80,
            rating_count: 2
        },
        followers_count: 12
    };

    // Use the real data if available, otherwise fallback to dummy data
    const sellerData = {
        ...seller,
        rating_summary: seller.rating_summary || dummyRating.rating_summary,
        followers_count: seller.followers_count || dummyRating.followers_count
    };

    const dataTabs =
        [
            {
                id: 'product-tab',
                title: 'All Products',
                content: <SellerProducts sellerId={seller?.seller_id} seller={seller} />
            },
            {
                id: 'store-information',
                title: 'Store Information',
                content: <SellerInformation seller={seller} />
            },
            {
                id: 'reviews',
                title: 'Reviews',
                content: <Reviews seller={seller} />
            }
        ];

    const [openChat, setOpenChat] = useState(false);
    const toggleChat = () => {
        setOpenChat(!openChat);
    }

    const addToFavourite = () => {
        
    }

    const getSellerAddressDisplay = (seller) => {
        let city = seller?.city;
        let country = seller?.country;

        let result = '';
        if (city && country) {
            result = `${city}, ${country}`;
        }
        if (city && !country) {
            result = `${city}`;
        }
        if (!city && country) {
            result = `${country}`;
        }        
        return result;
    }

    return (
        <div className=' py-8'>
            <style>{`
                .send-message-btn:hover { background: #f76b1c !important; }
                .send-message-btn:hover .stroke { stroke: #ffffff !important; }
                .send-message-btn:hover span { color: #ffffff !important; }
                .share-btn:hover { background: #f76b1c !important; }
                .share-btn:hover .stroke { stroke: #ffffff !important; }
                .share-btn:hover span { color: #ffffff !important; }
                .favorite-btn:hover { background: #f76b1c !important; color: #ffffff !important; }
                .favorite-btn:hover span { color: #ffffff !important; }
                .favorite-btn:hover svg { stroke: #ffffff !important; fill: #ffffff !important; }
            `}</style>
            <Slider seller={seller} rootClassname='mb-[30px]' />
            <div className='flex xs_flex-col lg_flex-row justify-between mb-[30px] p-[20px] rounded-[6px] border border-solid border-gray-100 shadow-[0px_0px_5px_3px_#d9d9d933]'>
                {/* Left: logo + info */}
                <div className='flex xs_flex-col md_flex-row xs_items-center md_items-start items-start gap-[15px] relative'>
                    {seller?.thumbnail ? (
                        <Image
                            alt={seller.name}
                            width='100'
                            style={{"height":'100px',"objectFit":"cover"}}
                            src={seller.thumbnail || ''} />
                    ) : (
                        <div className='flex items-center justify-center bg-gray-300 border rounded-radius1 relative w-[100px] h-[100px]'>
                            <Shop size="48" color="#F2F2F2" variant="Outline" />
                        </div>
                    )}

                    <div className='flex flex-col xs_items-center md_items-start justify-between relative gap-y-[10px]'>
                        <div className='flex flex-col xs_items-center md_items-start gap-[6px] relative'>
                            <div className="gap-x-[10px] gap-y-1 flex xs_flex-col md_flex-row xs_items-center md_items-start relative">
                                <div className="relative w-fit mt-[-1.00px] font-medium text-[20px] tracking-[0] leading-[24px] whitespace-nowrap text-center md_text-left">
                                    {seller ? seller.name : ''}
                                </div>
                            </div>
                        </div>

                        {/* Rating summary and followers */}
                        <div className='flex flex-col gap-[4px]'>
                            <div className='flex items-center gap-[6px] flex-wrap justify-center md_justify-start'>
                                <Rating percentage={sellerData.rating_summary.average_rating_percent} />
                                <span className='text-[12px] text-[#1a1a1a] text-center md_text-left'>
                                    <b>{sellerData.rating_summary.positive_percentage}% positive</b> in last 12 month ({sellerData.rating_summary.rating_count} Ratings)
                                </span>
                            </div>
                            <div className='text-[12px] text-[#666] text-center md_text-left'>{sellerData.followers_count} Followers</div>
                        </div>
                    </div>
                </div>
                
                {/* Right: action buttons */}
                <div className='flex xs_flex-wrap items-center xs_justify-center lg_justify-end gap-[10px] xs_mt-4 lg_mt-0 xs_pt-2 lg_pt-0 relative'>
                      <button className='send-message-btn flex items-center justify-center gap-[8px] px-[14px] py-[8px] bg-white rounded-[30px] border border-solid border-[#f76b1c] min-w-[44px]'>
                        <Sms color="#f76b1c" size={16} variant='Outline' className='stroke' />
                        <span className='text-[#f76b1c] text-[14px] font-medium whitespace-nowrap md_block xs_hidden'>Send Message</span>
                    </button>
                    <Suspense fallback={null}>
                        <FavoriteSellerButton
                            classes={{
                                root: 'favorite-btn flex items-center justify-center gap-[8px] px-[14px] py-[8px] bg-white rounded-[30px] border border-solid border-[#f76b1c] min-w-[44px]'
                            }}
                            {...favoriteSellerButtonProps}
                            buttonText={'Follow Seller'}
                            hideTextOnMobile={true}
                            afterAdd={isSelected => {
                                if (!isSelected) history.push('/favorite-seller');
                            }}
                        />
                    </Suspense>
                    <button className='share-btn flex items-center justify-center gap-[8px] px-[14px] py-[8px] bg-white rounded-[30px] border border-solid border-[#f76b1c] min-w-[44px]'>
                        <Share color='#f76b1c' size={16} variant='Outline' className='stroke' />
                        <span className='text-[#f76b1c] text-[14px] font-medium whitespace-nowrap md_block xs_hidden'>Share</span>
                    </button>
                </div>
            </div>
            <Tabs
                data={dataTabs}
                tabContentWrapperClassName='!p-0'
                hasContent
                tabWrapperClassName='xl_gap-x-[60px]'
                tabActiveClassName='!border-[#FF6E26] !border-b-[3px]'
            />
        </div>
    )
}

export default SellerDetail;

