import React from 'react';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Image from '@magento/venia-ui/lib/components/Image';
import { Link } from 'react-router-dom';
import Button from '@magento/venia-ui/lib/components/Button';
import ChatContent from '../LiveChat/chatContent';
import cn from 'classnames';
import { Send } from 'iconsax-react';

const quoteDetail = () => {
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextQuoteDetail',
        defaultMessage: 'Quote Detail'
    });

    const urlImage = 'https://pwa-tcgcollective.local:8255/media/catalog/product/s/-/s-l1600_6__1.jpg?auto=webp&format=pjpg&width=495&height=618.75&fit=cover';
    const dummyChat = [
        {
            "message": "May I help you",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "Yes",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "can i get a discount",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "you can redeem this code 'JunePlay'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "or this code 'collectfest'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "May I help you",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "Yes",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "can i get a discount",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "you can redeem this code 'JunePlay'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "or this code 'collectfest'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
    ]

    return (
        <div className='relative grid gap-y-md'>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left">
                {PAGE_TITLE} - DEV123123123
            </div>
            <div className='rounded-md border border-gray-100 px-4 py-6 flex flex-col-reverse md_flex-row justify-between gap-x-10'>
                <div className='flex flex-col gap-y-4 w-full md_w-6/12'>
                    <div className='block p-2 -ml-2 -mr-2 bg-[#F1EFF6] rounded-md'>
                        <p className='text-[13px] text-blue-700 flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.labelStatus',
                                        defaultMessage: 'Quote Status'
                                    })
                                }
                            </span>
                            <span className='font-medium block text-blue-700'>
                                Approve
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.labelQty',
                                        defaultMessage: 'Quantity'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                4 Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminSuggestedQty',
                                        defaultMessage: 'Admin Suggested Quantity'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                4 Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.expectedPrice',
                                        defaultMessage: 'Expected Price'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                $50.00 Per Unit
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminSuggestedPrice',
                                        defaultMessage: 'Admin Suggested Price'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                $55.00 Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.expectedTotal',
                                        defaultMessage: 'Expected Total'
                                    })
                                }
                            </span>
                            <span className='font-medium block'>
                                $200.00 Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminSuggestedTotal',
                                        defaultMessage: 'Admin Suggested Total'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                $220.00 Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminAddedCouponCode',
                                        defaultMessage: 'Admin Added Coupon Code'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                H20
                            </span>
                        </p>
                        <small className='text-[10px] text-gray-600'>
                            {
                                formatMessage({
                                    id: 'Quotes.couponCodeNotes',
                                    defaultMessage: 'You can apply coupon code when checkout order for this quote'
                                })
                            }
                        </small>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.seller',
                                        defaultMessage: 'Seller'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                Gundam Info
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.dateNeedQuote',
                                        defaultMessage: 'Date Need Quote'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                2024-08-22
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.expiryDateForOrder',
                                        defaultMessage: 'Expiry Date For Create Order'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                2024-08-30
                            </span>
                        </p>
                    </div>
                </div>
                <div className='relative flex w-full md_w-6/12 justify-center flex-col mb-10 md_mb-0'>
                    <Image
                        alt='product image'
                        className="relative max-w-[300px]"
                        src={urlImage}
                        classes={{
                            root: ' relative self-center mb-5'
                        }}
                    />

                    <p className='text-[16px] font-medium text-colorDefault text-center'>
                        $60.00
                    </p>

                    <Link to="/pop-mart-star-wars-series-blind-box-confirmed-figures-designer-art-new-toys-gift.html" className="max-w-[360px] self-center mb-5">
                        <span className=" text-[13px] block text-center font-medium text-colorDefault w-full">
                            POP MART Star Wars Series Blind Box Confirmed Figures Designer Art New Toys Gift
                        </span>
                    </Link>
                    <Button
                        priority='high'
                        classes={{
                            content: 'capitalize text-[16px] font-medium'
                        }}
                    >
                        {
                            formatMessage({
                                id: 'Quotes.addToCart',
                                defaultMessage: 'Add To Cart'
                            })
                        }
                    </Button>
                </div>
            </div>
            <div className=' flex flex-col mb-10'>
                <div aria-live="polite" className="text-lg font-medium text-left mb-4">
                    Messages
                </div>
                <div className='rounded-md border border-gray-100 p-4 pr-0 pt-0 flex flex-col gap-y-6'>
                    <div className='max-h-[600px] overflow-auto relative chat-container pr-4 pt-4'>
                        <ChatContent chatData={dummyChat} />
                    </div>
                    <div className='flex gap-2 pr-4'>
                        <textarea
                            className='w-full focus-visible_outline-none border border-gray-100 p-1 rounded-md'
                            cols={5}
                        />
                        <Button
                            priority='high'
                            classes={{
                                content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                            }}
                            className={cn(
                                "bg-blue-600 px-6 py-2 rounded-full text-white border ",
                                "border-blue-600 hover_bg-blue-700 hover_border-blue-700 focus-visible_outline-none"
                            )}
                        >
                            <Send
                                size="24"
                                className='text-white'
                            />
                        </Button>
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                    .chat-container::-webkit-scrollbar {
                        width: 8px;
                        border-radius: 5px;
                    }
                    
                    .chat-container::-webkit-scrollbar-track {
                        background: #f2f2f2;
                        border-radius: 8px;
                    }
                    
                    .chat-container::-webkit-scrollbar-thumb {
                        background-color: #c3c3c3;
                        border-radius: 20px;
                        border: 2px solid #f2f2f2;
                    }
                `}
            </style>
        </div>
    )
}

export default quoteDetail