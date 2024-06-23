import React, { useState } from 'react';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import Button from '@magento/venia-ui/lib/components/Button';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import BidList from './bidList';
import { X } from 'react-feather';
import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import { Form } from 'informed';
import Price from '@magento/venia-ui/lib/components/Price';
import Countdown from 'react-countdown';

const AuctionDetail = (props) => {

    const { className, productDetails } = props;
    const [open, setOpen] = useState(false)

    const auctionData = productDetails?.auction_data;

    const isAuction = auctionData?.is_auction ? true : false;

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const Completionist = () => <span>You are good to go!</span>;

    // Renderer callback with condition
    const renderer = ({ hours, minutes, days, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <Completionist />;
    } else {
        // Render a countdown
        return <div className='flex flex-row gap-8'>
            <div className='flex flex-col'>
                <div className='text-[40px] leading-[normal] font-semibold'>
                {days}
                </div>
                <div className='text-[14px] font-bold'>
                    days
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='text-[40px] leading-[normal] font-semibold'>
                {hours}
                </div>
                <div className='text-[14px] font-bold'>
                    hours
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='text-[40px] leading-[normal] font-semibold'>
                {minutes}
                </div>
                <div className='text-[14px] font-bold'>
                    minutes
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='text-[40px] leading-[normal] font-semibold'>
                {seconds}
                </div>
                <div className='text-[14px] font-bold'>
                    seconds
                </div>
            </div>
        </div>;
    }
    };

    console.log(auctionData)

    const endDate = auctionData && auctionData.stop_auction_time ? new Date(auctionData.stop_auction_time) : null;

    return isAuction && <>
        <Modal
            open={open}
            className='!p-[30px] md_min-w-[550px] modal_bid'
        >
            <div className='modal_bid-content'>
                <div className='header_title-modal flex justify-between mb-10'>
                    <div className='text-lg text-black font-semibold'>
                        Place bid
                    </div>
                    <button onClick={() => { setOpen(!open) }} >
                        <X size={24} color={primary900} />
                    </button>
                </div>

                <div className='flex flex-col gap-y-[25px]'>
                    <div className='current_bid flex flex-col gap-y-2.5'>
                        <span className='text-[14px] font-bold text-gray-500'>
                            Current bid
                        </span>
                        <span className='text-2xl font-semibold'>
                            $102.50
                        </span>
                    </div>

                    <BidList expanded />
                    <Form
                        data-cy="form_bid"
                        className="flex flex-col gap-y-5"
                        initialValues={{}}
                        onSubmit={() => { }}
                        onChange={() => { }}
                    >
                        <Field
                            id="bid_amount_field"
                            label={'Bid Amount'}
                        >
                            <TextInput
                                id="bid_amout"
                                field="bid_amount"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                data-cy="bid_amount"
                                aria-label={'bid_amount'}
                                placeholder={'$10.00'}
                            />
                            <small className='helpet-text text-[12px] font-normal text-gray-200 mt-1'>
                                Enter $103.50 or more
                            </small>
                        </Field>

                        <Checkbox
                            field="auto_bid"
                            id="auto_bid"
                            label={'Place Bid As Automatic'}
                        />

                        <div className='actions flex justify-end gap-x-2.5'>
                            <Button
                                priority='low'
                                classes={{
                                    content: 'capitalize text-[16px] font-semibold'
                                }}
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                priority='high'
                                classes={{
                                    content: 'capitalize text-[16px] font-semibold'
                                }}
                            >
                                Place Bid
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
        <div
            className={cn(
                'flex flex-col border border-gray-100 rounded-lg px-5 py-[30px] gap-x-2.5 gap-y-5',
                className
            )}
        >
            <div className='flex flex-row justify-between'>
                <div className='flex flex-col gap-2.5'>
                    <div className='text-[16px] font-bold text-gray-500'>
                        Starting Price
                    </div>
                    <div className='text-[40px] font-semibold text-colorDefault'>
                        <Price
                            currencyCode={productDetails.price.currency}
                            value={auctionData.starting_price}
                        />
                    </div>
                </div>
                <Divider className="w-[1px] !h-[105px]" />
                <div className='flex flex-col gap-2.5'>
                    <div className='text-[16px] font-bold text-gray-500'>
                        Auction ends in
                    </div>
                    <Countdown
                        date={new Date(auctionData.stop_auction_time)}
                        renderer={renderer}
                    />
                </div>
            </div>

            <div className='text-gray-800 font-bold text-[20px]'>
                {/* Ends at January 12, 2024 10:15 AM */}
                Ends at {month[endDate.getMonth()] + ' ' + endDate.getDate() + ', ' + endDate.getFullYear() + ' ' + endDate.getHours() + ':' + endDate.getMinutes() + ':' + endDate.getSeconds()}
            </div>

            <Button
                priority='high'
                classes={{
                    content: 'capitalize text-[16px] font-semibold'
                }}
                onClick={() => setOpen(true)}
            >
                Place Bid
            </Button>

            <BidList {...props} />
        </div>
    </>
}

export default AuctionDetail;