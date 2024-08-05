import React from 'react';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Button from '@magento/venia-ui/lib/components/Button';
import cn from 'classnames';
import { Printer } from 'iconsax-react';
// import Tabs from '@riosst100/pwa-marketplace/src/components/commons/Tabs';
import ItemsOrdered from './components/itemsOrdered';
import RMAList from './components/rmaList';

const OrderDetail = () => {
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextRMADetail',
        defaultMessage: 'Order Detail'
    });

    // const dataTabs =
    //     [
    //         {
    //             id: 'items-ordered',
    //             title: 'Items Ordered',
    //             content: <ItemsOrdered />
    //         },
    //         {
    //             id: 'invoices',
    //             title: 'Invoices',
    //             content: <><h2>invoices</h2></>
    //         },
    //         {
    //             id: 'order-shipments',
    //             title: 'Order Shipments',
    //             content: <><h2>Order shipments</h2></>
    //         }
    //     ];

    return (
        <div className='relative grid gap-y-md'>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left">
                {PAGE_TITLE} - DEV123123123
            </div>
            <div className='block relative'>
                <div className='flex gap-2 mb-4 flex-col'>
                    <div class="box box-order-shipping-method flex gap-4">
                        <p class="box-title block min-w-[90px] font-semibold text-[14px]">
                            <span>Invoice</span>
                        </p>
                        <div class="box-content text-[14px]">
                            INV/20240705/MPL/4007072581
                        </div>
                    </div>
                    <div class="box box-order-shipping-method flex gap-4 text-[14px]">
                        <p class="box-title block min-w-[90px] font-semibold">
                            <span>Order Date</span>
                        </p>
                        <div class="box-content text-[14px]">
                            February 23, 2024
                        </div>
                    </div>
                    <div class="box box-order-shipping-method flex gap-4 text-[14px]">
                        <p class="box-title block min-w-[90px] font-semibold self-center">
                            <span>Status</span>
                        </p>
                        <div class="box-content text-[14px]">
                            <div className='p-1 bg-[#F1EFF6] rounded-md flex items-center px-5'>
                                <p className='text-[14px] text-blue-700 flex justify-between'>
                                    <span className='font-medium block text-blue-700'>
                                        Processing
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md_flex-row gap-x-4 justify-end'>
                    <Button
                        priority='high'
                        classes={{
                            content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                        }}
                        className={cn(
                            "bg-white px-6 py-2 rounded-md text-gray-900 hover_!text-white border border-solid",
                            "border-gray-900 focus-visible_outline-none hover_bg-gray-900 min-h-[40px]"
                        )}
                    >
                        <span className='flex gap-x-3 justify-center group-hover_!text-white'>
                            <Printer
                                size="24"
                                className=''
                            />
                            {
                                formatMessage({
                                    id: 'order.PrintInvoices',
                                    defaultMessage: 'Print Invoices'
                                })
                            }
                        </span>
                    </Button>
                </div>
            </div>

            {/* <Tabs
                data={dataTabs}
                tabContentWrapperClassName='!p-0'
                hasContent
                tabWrapperClassName='xl_gap-x-[60px]'
                rootClassName="mb-0"
            /> */}
            <div class="block block-order-details-view">
                <div aria-live="polite" className="text-lg font-medium text-left mb-4 block-title">
                    {
                        formatMessage({
                            id: 'order.productInfomarion',
                            defaultMessage: 'Product Information'
                        })
                    }
                </div>

                <ItemsOrdered />
            </div>

            <div class="block block-order-details-view">
                <div aria-live="polite" className="text-lg font-medium text-left mb-4 block-title">
                    {
                        formatMessage({
                            id: 'order.rmaInformation',
                            defaultMessage: 'RMA Information'
                        })
                    }
                </div>

                <RMAList />
            </div>

            <div class="block block-order-details-view">
                <div aria-live="polite" className="text-lg font-medium text-left mb-4 block-title">
                    {
                        formatMessage({
                            id: 'order.OrderInformation',
                            defaultMessage: 'Order Information'
                        })
                    }
                </div>
                <div class="block-content flex flex-col gap-y-4 rounded-md border border-gray-100 px-4 py-6 justify-between gap-x-10">
                    <div class="box box-order-shipping-method flex gap-4">
                        <strong class="box-title block min-w-[140px]">
                            <span>Shipping Method</span>
                        </strong>
                        <div class="box-content">
                            Flat Rate - Fixed
                        </div>
                    </div>
                    <div class="box box-order-shipping-method flex gap-4">
                        <strong class="box-title block min-w-[140px]">
                            <span>Tracking Number</span>
                        </strong>
                        <div class="box-content">
                            TX8971239123
                        </div>
                    </div>
                    <div class="box box-order-shipping-address flex gap-4">
                        <strong class="box-title block min-w-[140px]"><span>Shipping Address</span></strong>
                        <div class="box-content">
                            <div className=' whitespace-pre-wrap'>
                                Veronica Costello{'\n'}
                                6146 Honey Bluff Parkway{'\n'}
                                Calder, Michigan, 49628-7978{'\n'}
                                United States{'\n'}
                                T: <a href="tel:(555) 229-3326">(555) 229-3326</a>
                            </div>
                        </div>
                    </div>
                    <div class="box box-order-billing-method flex gap-4">
                        <strong class="box-title block min-w-[140px]">
                            <span>Payment Method</span>
                        </strong>
                        <div class="box-content">
                            <dl class="payment-method checkmemo">
                                <dt class="title">Check / Money order</dt>
                            </dl>
                        </div>
                    </div>
                    <div class="box box-order-billing-address flex gap-4">
                        <strong class="box-title block min-w-[140px]">
                            <span>Billing Address</span>
                        </strong>
                        <div class="box-content">
                            <div className='whitespace-pre-wrap'>
                                Veronica Costello{'\n'}
                                6146 Honey Bluff Parkway{'\n'}
                                Calder, Michigan, 49628-7978{'\n'}
                                United States{'\n'}
                                T: <a href="tel:(555) 229-3326">(555) 229-3326</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail;