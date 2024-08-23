import React from 'react'
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const rmaList = () => {
    const { formatMessage } = useIntl();

    return (
        <>
            <div className='rounded-md border border-gray-100'>
                <div class="hidden md_block table-wrapper order-items w-full">
                    <table class="data table table-order-items w-full" id="my-orders-table" summary="Items Ordered">
                        <thead>
                            <tr className='bg-gray-150'>
                                <th class="col text-left py-3 px-2.5 rounded-tl-md">RMA</th>
                                <th class="col text-left py-3 px-2.5">Date</th>
                                <th class="col text-left py-3 px-2.5">Order</th>
                                <th class="col text-left py-3 px-2.5">Status</th>
                                <th class="col text-left py-3 px-2.5 rounded-tr-md">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="order-item-row-1" className='border-b border-gray-150 last-of-type_border-0'>
                                <td class="col rma text-left align-top py-3 px-2.5" data-th="Product Name">
                                    <span className='font-semibold'>
                                        3000000011-2
                                    </span>
                                </td>
                                <td class="col date align-top py-3 px-2.5" data-th="SKU">
                                    <span className='font-normal'>
                                        Jun 29, 2024
                                    </span>
                                </td>
                                <td class="col order text-left align-top py-3 px-2.5" data-th="Price">
                                    <Link to={'/order/123123'} className="underline">
                                        3000000011
                                    </Link>
                                </td>
                                <td class="col qty text-left align-top py-3 px-2.5" data-th="Qty">
                                    <p className='p-1 bg-[#F1EFF6] rounded-md flex items-center px-5 w-fit'>
                                        <span className='font-medium block text-blue-700'>
                                            Pending Approval
                                        </span>
                                    </p>
                                </td>
                                <td class="col subtotal text-left align-top py-3 px-2.5" data-th="Subtotal">
                                    <Link to={'/return/123123'} className="underline">
                                        View Return
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='md_hidden'>
                    <div class="orderDetails-orderTotalContainer-6or m-0 max-w-none min-w-none lg_m-auto lg_max-w-[25rem] lg_min-w-[22rem]">
                        <div className='item flex flex-col gap-2 p-4 odd_border border-gray-150 last-of-type_border-0'>
                            <div className='flex gap-3'>
                                <div className='min-w-[60px] text-[14px] font-semibold'>
                                    RMA
                                </div>
                                <div className='min-w-[60px] text-[14px]'>
                                    3000000011-2
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='min-w-[60px] text-[14px] font-semibold'>
                                    Date
                                </div>
                                <div className='min-w-[60px] text-[14px]'>
                                    Jun 29, 2024
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='min-w-[60px] text-[14px] font-semibold'>
                                    Order
                                </div>
                                <div className='min-w-[60px] text-[14px]'>
                                    <Link to={'/order-history/view/123123'} className="underline">
                                        3000000011
                                    </Link>
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='min-w-[60px] text-[14px] font-semibold self-center'>
                                    Status
                                </div>
                                <div className='min-w-[60px] text-[14px]'>
                                    <p className='p-1 bg-[#F1EFF6] rounded-md flex items-center px-5 w-fit'>
                                        <span className='font-medium block text-blue-700'>
                                            Pending Approval
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='min-w-[60px] text-[14px] font-semibold self-center'>
                                    Action
                                </div>
                                <div className='min-w-[60px] text-[14px]'>
                                    <Link to={'/return/view/123123'} className="underline">
                                        View Return
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default rmaList