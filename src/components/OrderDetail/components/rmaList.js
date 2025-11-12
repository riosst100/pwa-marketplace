import React from 'react'
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const rmaList = ({ rmas, isLoadingWithoutData }) => {
    const { formatMessage } = useIntl();

    return (
        <>
            <div className='rounded-md border border-gray-100'>
                <div className="hidden md_block table-wrapper order-items w-full">
                    <table className="data table table-order-items w-full" id="my-orders-table" summary="Items Ordered">
                        <thead>
                            <tr className='bg-gray-150'>
                                <th className="col text-left py-3 px-2.5 rounded-tl-md">RMA</th>
                                <th className="col text-left py-3 px-2.5">Date</th>
                                <th className="col text-left py-3 px-2.5">Order</th>
                                <th className="col text-left py-3 px-2.5">Status</th>
                                <th className="col text-left py-3 px-2.5 rounded-tr-md">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rmas && rmas.length > 0 ? (
                                rmas.map((rma, idx) => {
                                    const formattedDate = rma.created_at ? new Date(rma.created_at.replace(' ', 'T')).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
                                    return (
                                        <tr key={rma.rma_id || idx} className='border-b border-gray-150 last-of-type_border-0'>
                                            <td className="col rma text-left align-top py-3 px-2.5" data-th="RMA">
                                                <span className='font-semibold'>{rma.increment_id}</span>
                                            </td>
                                            <td className="col date align-top py-3 px-2.5" data-th="Date">
                                                <span className='font-normal'>{formattedDate}</span>
                                            </td>
                                            <td className="col order text-left align-top py-3 px-2.5" data-th="Order">
                                                {rma.order_increment_id || (rma.order && rma.order.increment_id) || '-'}
                                            </td>
                                            <td className="col qty text-left align-top py-3 px-2.5" data-th="Status">
                                                <p className='p-1 flex items-center w-fit'>
                                                    <span className='font-medium block text-blue-700'>{rma.status_label || rma.status}</span>
                                                </p>
                                            </td>
                                            <td className="col subtotal text-left align-top py-3 px-2.5" data-th="Action">
                                                <Link to={`/return/view/${rma.rma_id}`} className="underline">
                                                    View Return
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan={5} className='text-center py-4'>No RMA found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='md_hidden'>
                    <div className="orderDetails-orderTotalContainer-6or m-0 max-w-none min-w-none lg_m-auto lg_max-w-[25rem] lg_min-w-[22rem]">
                        {rmas && rmas.length > 0 ? (
                            rmas.map((rma, idx) => {
                                const formattedDate = rma.created_at ? new Date(rma.created_at.replace(' ', 'T')).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
                                return (
                                    <div key={rma.rma_id || idx} className='item flex flex-col gap-2 p-4 odd_border border-gray-150 last-of-type_border-0'>
                                        <div className='flex gap-3'>
                                            <div className='min-w-[60px] text-[14px] font-semibold'>RMA</div>
                                            <div className='min-w-[60px] text-[14px]'>{rma.increment_id}</div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='min-w-[60px] text-[14px] font-semibold'>Date</div>
                                            <div className='min-w-[60px] text-[14px]'>{formattedDate}</div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='min-w-[60px] text-[14px] font-semibold'>Order</div>
                                            <div className='min-w-[60px] text-[14px]'>
                                                {rma.order_increment_id || (rma.order && rma.order.increment_id) || '-'}
                                            </div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='min-w-[60px] text-[14px] font-semibold self-center'>Status</div>
                                            <div className='min-w-[60px] text-[14px]'>
                                                <p className='p-1 bg-[#F1EFF6] rounded-md flex items-center px-5 w-fit'>
                                                    <span className='font-medium block text-blue-700'>{rma.status_label || rma.status}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='min-w-[60px] text-[14px] font-semibold self-center'>Action</div>
                                            <div className='min-w-[60px] text-[14px]'>
                                                <Link to={`/return/view/${rma.rma_id}`} className="underline">
                                                    View Return
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className='text-center py-4'>No RMA found.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default rmaList