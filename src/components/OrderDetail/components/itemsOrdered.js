import React from 'react'
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const itemsOrdered = () => {
    const { formatMessage } = useIntl();

    return (
        <>
            <div className='rounded-md border border-gray-100 pb-4'>
                <div class="hidden md_block table-wrapper order-items w-full">
                    <table class="data table table-order-items w-full" id="my-orders-table" summary="Items Ordered">
                        <thead>
                            <tr className='bg-gray-150'>
                                <th class="col name text-left py-3 px-2.5 rounded-tl-md">Product Name</th>
                                <th class="col sku text-left py-3 px-2.5">SKU</th>
                                <th class="col price text-right py-3 px-2.5">Price</th>
                                <th class="col qty text-right py-3 px-2.5">Qty</th>
                                <th class="col subtotal text-right py-3 px-2.5 rounded-tr-md">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="order-item-row-1" className='border-b border-gray-150'>
                                <td class="col name text-left align-top py-3 px-2.5" data-th="Product Name">
                                    <strong class="product name product-item-name">Iris Workout Top</strong>
                                    <dl class="item-options">
                                        <dt>Size</dt>
                                        <dd>
                                            XS
                                        </dd>
                                        <dt>Color</dt>
                                        <dd>
                                            Red
                                        </dd>
                                    </dl>
                                </td>
                                <td class="col sku align-top py-3 px-2.5" data-th="SKU">
                                    WS03-XS-Red
                                </td>
                                <td class="col price text-right align-top py-3 px-2.5" data-th="Price">
                                    <span class="price-including-tax" data-label="Incl. Tax">
                                        <span class="cart-price">
                                            <span class="price">$31.39</span> </span>
                                    </span>
                                </td>
                                <td class="col qty text-right align-top py-3 px-2.5" data-th="Qty">
                                    <ul class="items-qty">
                                        <li class="item">
                                            <span class="content">
                                                1
                                            </span>
                                        </li>
                                    </ul>
                                </td>
                                <td class="col subtotal text-right align-top py-3 px-2.5" data-th="Subtotal">
                                    <span class="price-including-tax" data-label="Incl. Tax">
                                        <span class="cart-price">
                                            <span class="price">$31.39</span> </span>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot className='text-right'>
                            <tr class="subtotal">
                                <th colspan="4" class="mark py-1 px-2.5 pt-2.5" scope="row">
                                    Subtotal
                                </th>
                                <td class="amount py-1 px-2.5 pt-2.5" data-th="Subtotal">
                                    <span class="price">$31.39</span>
                                </td>
                            </tr>
                            <tr class="shipping">
                                <th colspan="4" class="mark py-1 px-2.5" scope="row">
                                    Shipping &amp; Handling
                                </th>
                                <td class="amount py-1 px-2.5" data-th="Shipping &amp; Handling">
                                    <span class="price">$5.00</span>
                                </td>
                            </tr>
                            <tr class="totals-tax">
                                <th colspan="4" class="mark py-1 px-2.5" scope="row">
                                    Tax
                                </th>
                                <td class="amount py-1 px-2.5" data-th="Tax">
                                    <span class="price">$2.39</span>
                                </td>
                            </tr>
                            <tr class="grand_total">
                                <th colspan="4" class="mark py-1 px-2.5" scope="row">
                                    <strong>Grand Total</strong>
                                </th>
                                <td class="amount py-1 px-2.5" data-th="Grand Total">
                                    <strong><span class="price">$36.39</span></strong>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className='md_hidden'>
                    <div class="orderDetails-orderTotalContainer-6or m-0 max-w-none min-w-none lg_m-auto lg_max-w-[25rem] lg_min-w-[22rem]">
                        <div className='product-list p-4'>
                            <div className='order-item flex flex-col gap-2 pb-4 border-b border-gray-150 even_pt-2'>
                                <Link to="/">
                                    <span>
                                        STAR WARS The Vintage Collection Luke Skywalker (Jedi Academy), The Book of Boba Fett 3.75-Inch Collectible Action Figures, Ages 4 and Up
                                    </span>
                                </Link>
                                <div className='flex gap-2'>
                                    <span className='font-semibold'>
                                        1 X SGD 15.76
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 pt-0 border-0 gap-xs grid py-xs rounded-none lg_border lg_border-solid lg_border-gray-100 lg_p-xs lg_rounded-md">
                            <div class="orderTotal-subTotal-Eyf gap-xs grid grid-cols-autoLast"><span>Subtotal</span><span><span>SGD</span><span>&nbsp;</span><span>15</span><span>.</span><span>76</span></span></div>
                            <div class="orderTotal-tax-DF0 gap-xs grid grid-cols-autoLast"><span>Tax</span><span><span>SGD</span><span>&nbsp;</span><span>0</span><span>.</span><span>00</span></span></div>
                            <div class="orderTotal-shipping-dXC gap-xs grid grid-cols-autoLast"><span>Shipping</span><span><span>SGD</span><span>&nbsp;</span><span>5</span><span>.</span><span>00</span></span></div>
                            <div class="orderTotal-total-s5t font-bold gap-xs grid grid-cols-autoLast"><span>Total</span><span><span>SGD</span><span>&nbsp;</span><span>20</span><span>.</span><span>76</span></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default itemsOrdered