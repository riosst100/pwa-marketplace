import React from 'react';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Button from '@magento/venia-ui/lib/components/Button';
import ChatContent from '../LiveChat/chatContent';
import cn from 'classnames';
import { Send } from 'iconsax-react';
import Item from './components/productItem';

const RMACreate = () => {
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextRMACreate',
        defaultMessage: 'New Return'
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
            <div className='block relative'>
                <div aria-live="polite" className="text-lg font-medium text-left mb-4">
                    {
                        formatMessage({
                            id: 'RMA.requestReturnInformation',
                            defaultMessage: 'Request Return Information'
                        })
                    }
                </div>
                <div className='rounded-md border border-gray-100 px-4 py-6 flex flex-col md_flex-row justify-between gap-x-10'>
                    <div className='flex flex-col gap-y-4 w-full mb-4 md_0 md_w-6/12'>
                        <div className='block p-2 -ml-2 -mr-2 bg-[#F1EFF6] rounded-md'>
                            <p className='text-[13px] text-blue-700 flex justify-between'>
                                <span className='font-medium block'>
                                    {
                                        formatMessage({
                                            id: 'RMA.Status',
                                            defaultMessage: 'Status'
                                        })
                                    }
                                </span>
                                <span className='font-medium block text-blue-700'>
                                    Pending Approval
                                </span>
                            </p>
                        </div>
                        <div className='block'>
                            <p className='text-[13px] text-colorDefault flex justify-between'>
                                <span className='font-medium block'>
                                    {
                                        formatMessage({
                                            id: 'RMA.RMANumber',
                                            defaultMessage: 'RMA'
                                        })
                                    }
                                </span>
                                <span className='font-normal block'>
                                    DEV123123123-12
                                </span>
                            </p>
                        </div>
                        <div className='block'>
                            <p className='text-[13px] text-colorDefault flex justify-between'>
                                <span className='font-medium block'>
                                    {
                                        formatMessage({
                                            id: 'RMA.OrderNumber',
                                            defaultMessage: 'Order Number'
                                        })
                                    }
                                </span>
                                <span className='font-normal block'>
                                    DEV123123123 at Nov 8, 2024
                                </span>
                            </p>
                        </div>
                        <div className='block'>
                            <p className='text-[13px] text-colorDefault flex justify-between'>
                                <span className='font-medium block'>
                                    {
                                        formatMessage({
                                            id: 'RMA.dateRequested',
                                            defaultMessage: 'Date Requested'
                                        })
                                    }
                                </span>
                                <span className='font-normal block'>
                                    Nov 17, 2024
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className='relative flex w-full md_w-6/12 flex-col md_mb-0'>
                        <div className='flex flex-col'>
                            <p className='text-[13px] text-colorDefault flex justify-between'>
                                <span className='font-medium block'>
                                    {
                                        formatMessage({
                                            id: 'RMA.ContactInformation',
                                            defaultMessage: 'Contact Information'
                                        })
                                    }
                                </span>
                            </p>
                            <p className='text-[13px] text-colorDefault whitespace-pre-wrap'>
                                John Doe{'\n'}
                                johndoe@email.com{'\n'}
                                1233123412{'\n'}
                                6164 Honey Bluff Parkway{'\n'}
                                Calder{'\n'}
                                Michigan{'\n'}
                                UnitedState{'\n'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' flex flex-col'>
                <div aria-live="polite" className="text-lg font-medium text-left mb-4">
                    Items
                </div>
                <div className='border-t border-gray-100 py-4 flex flex-col gap-y-4'>
                    {[...Array(2)].map((item) => (
                        <Item withCheckbox />
                    ))}
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

export default RMACreate;