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
                                <th class="col text-left py-3 px-2.5 rounded-tl-md">Order</th>
                                <th class="col text-left py-3 px-2.5">Date</th>
                                <th class="col text-left py-3 px-2.5">Ship To</th>
                                <th class="col text-left py-3 px-2.5">Total</th>
                                <th class="col text-left py-3 px-2.5">Status</th>
                                <th class="col text-left py-3 px-2.5 rounded-tr-md">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="order-item-row-1" className='item'>
                                <td class="col rma text-left align-top py-3 px-2.5" data-th="Product Name">
                                    <span className='font-semibold'>
                                        3000000011
                                    </span>
                                </td>
                                <td class="col date align-top py-3 px-2.5" data-th="SKU">
                                    <span className='font-normal'>
                                        Jun 29, 2024
                                    </span>
                                </td>
                                <td class="col date align-top py-3 px-2.5" data-th="SKU">
                                    <span className='font-normal'>
                                        John Doe
                                    </span>
                                </td>
                                <td class="col order text-left align-top py-3 px-2.5" data-th="Price">
                                    <span className='font-normal'>
                                        SGD 34.69
                                    </span>
                                </td>
                                <td class="col qty text-left align-top py-3 px-2.5" data-th="Qty">
                                    <p className='p-1 bg-[#F1EFF6] rounded-md flex items-center px-5 w-fit'>
                                        <span className='font-medium block text-blue-700'>
                                            Pending Approval
                                        </span>
                                    </p>
                                </td>
                                <td class="col subtotal text-left align-top py-3 px-2.5" data-th="Subtotal">
                                    <Link to={'/return/view/123123'} className="underline">
                                        View Return
                                    </Link>
                                </td>
                            </tr>
                            <tr class="seller-order-info border-b border-gray-150 last-of-type_border-0">
                                <td data-th="Order #" class="col id">&nbsp;</td>
                                <td data-th="Date" class="col date">&nbsp;</td>
                                <td data-th="Ship To" class="col shipping">&nbsp;</td>
                                <td data-th="Seller: " class="col total">&nbsp;</td>
                                <td class="col status text-left align-top py-3 px-2.5">
                                    <span className='font-semibold mr-1'>Seller </span>
                                    <Link to="/seller/test-store" target="_BLANK" title="View The Seller" className="underline">
                                        Test Store
                                    </Link>
                                </td>
                                <td data-th="Actions" class="col actions text-left align-top py-3 px-2.5">
                                    <Link to="/return/create/123123" class="action return underline">
                                        <span>Return to Seller</span>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* <div class="block">
                    <div class="block-title">
                        <strong>Select an order to return</strong>
                    </div>
                    <div class="block-content">
                        <div class="order-filter-form-wrappger">
                            <form action="https://seller-dev.tcgcollective.co/returns/rma/sellect/" id="form-search-order" method="GET">
                                <table class="data table table-order-finder-items" id="my-orders-finder-table">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="col order-id">Order ID</th>
                                            <th scope="col" class="col product-name">Product Name</th>
                                            <th scope="col" class="col order-date">Order Date</th>
                                            <th scope="col" class="col sort-by">Sort</th>
                                            <th scope="col" class="col actions">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td data-th="Order ID" class="col order-id">
                                                <input type="text" class="input-text" name="id" placeholder="Search by Order ID" value="" />
                                            </td>
                                            <td data-th="Product Name" class="col product-name">
                                                <input type="text" class="input-text" name="product" placeholder="Search by Product Name" value="" />
                                            </td>
                                            <td data-th="Order Date" class="col order-date">
                                                <input type="text" class="input-text hasDatepicker filterHasDatePicker _has-datepicker" id="filter-order-date-from" name="date_from" placeholder="From Date" value="" autocomplete="on" />
                                                <input type="text" class="input-text hasDatepicker filterHasDatePicker _has-datepicker" id="filter-order-date-to" name="date_to" placeholder="To Date" value="" autocomplete="on" />
                                            </td>
                                            <td data-th="Sort" class="col sort">
                                                <select name="sort" class="input-select">
                                                    <option value="">Default</option>
                                                    <option value="entity_id:ASC">ID ASC</option>
                                                    <option value="entity_id:DESC">ID DESC</option>
                                                    <option value="created_at:ASC">Order Date ASC</option>
                                                    <option value="created_at:DESC">Order Date DESC</option>
                                                    <option value="grand_total:ASC">Order Total ASC</option>
                                                    <option value="grand_total:DESC">Order Total DESC</option>
                                                </select>
                                            </td>
                                            <td data-th="Actions" class="col actions">
                                                <input type="submit" class="action save primary" name="submit" value="Submit" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div class="table-wrapper orders-history">
                            <table class="data table table-order-items history w-full" id="my-orders-table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="col id">Order #</th>
                                        <th scope="col" class="col date">Date</th>
                                        <th scope="col" class="col shipping">Ship To</th>
                                        <th scope="col" class="col total">Order Total</th>
                                        <th scope="col" class="col status">Status</th>
                                        <th scope="col" class="col actions">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td data-th="Order #" class="col id">#000000029</td>
                                        <td data-th="Date" class="col date">7/22/24</td>
                                        <td data-th="Ship To" class="col shipping">danis alifian 16</td>
                                        <td data-th="Order Total" class="col total"><span class="price">$34.69</span></td>
                                        <td data-th="Status" class="col status">Complete</td>
                                        <td data-th="Actions" class="col actions">
                                            <a href="https://seller-dev.tcgcollective.co/sales/order/view/order_id/41/" class="action view">
                                                <span>View Order</span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr class="seller-order-info">
                                        <td data-th="Order #" class="col id">&nbsp;</td>
                                        <td data-th="Date" class="col date">&nbsp;</td>
                                        <td data-th="Ship To" class="col shipping">&nbsp;</td>
                                        <td data-th="Seller: " class="col total"><strong><i>Seller: </i></strong></td>
                                        <td class="col status"><a href="https://dev.tcgcollective.co/seller/test-store" target="_BLANK" title="View The Seller">Test Store</a></td>
                                        <td data-th="Actions" class="col actions">
                                            <a href="https://seller-dev.tcgcollective.co/returns/rma/new/order_id/41/seller_id/6/" class="action return">
                                                <span>Return to Seller</span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td data-th="Order #" class="col id">#3000000011</td>
                                        <td data-th="Date" class="col date">5/25/24</td>
                                        <td data-th="Ship To" class="col shipping">danis alifian 16</td>
                                        <td data-th="Order Total" class="col total"><span class="price">SGD&nbsp;20.76</span></td>
                                        <td data-th="Status" class="col status">Complete</td>
                                        <td data-th="Actions" class="col actions">
                                            <a href="https://seller-dev.tcgcollective.co/sales/order/view/order_id/40/" class="action view">
                                                <span>View Order</span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr class="seller-order-info">
                                        <td data-th="Order #" class="col id">&nbsp;</td>
                                        <td data-th="Date" class="col date">&nbsp;</td>
                                        <td data-th="Ship To" class="col shipping">&nbsp;</td>
                                        <td data-th="Seller: " class="col total"><strong><i>Seller: </i></strong></td>
                                        <td class="col status"><a href="https://dev.tcgcollective.co/seller/test-store" target="_BLANK" title="View The Seller">Test Store</a></td>
                                        <td data-th="Actions" class="col actions">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div> */}

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
                                    <Link to={'/order/123123'} className="underline">
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
                                    <Link to={'/order/123123'} className="underline">
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