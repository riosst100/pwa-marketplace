import React from 'react'
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const ItemsOrdered = ({ order }) => {
    const { formatMessage } = useIntl();
    const items = order?.items || [];
    const currency = order?.total?.grand_total?.currency || '-';
    const subtotal = order?.total?.subtotal?.value || 0;
    const shipping = order?.total?.total_shipping?.value || 0;
    const tax = order?.total?.total_tax?.value || 0;
    const grandTotal = order?.total?.grand_total?.value || 0;

    return (
        <>
            <div className='rounded-md border border-gray-100 pb-4'>
                <div className="hidden md_block table-wrapper order-items w-full">
                    <table className="data table table-order-items w-full" id="my-orders-table" summary="Items Ordered">
                        <thead>
                            <tr className='bg-gray-150'>
                                <th className="col name text-left py-3 px-2.5 rounded-tl-md">Product Name</th>
                                <th className="col sku text-left py-3 px-2.5">SKU</th>
                                <th className="col price text-right py-3 px-2.5">Price</th>
                                <th className="col qty text-right py-3 px-2.5">Qty</th>
                                <th className="col subtotal text-right py-3 px-2.5 rounded-tr-md">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item.id || idx} className='border-b border-gray-150'>
                                    <td className="col name text-left align-top py-3 px-2.5" data-th="Product Name">
                                        <strong className="product name product-item-name">{item.product_name}</strong>
                                        {item.selected_options && item.selected_options.length > 0 && (
                                            <dl className="item-options">
                                                {item.selected_options.map((opt, i) => (
                                                    <React.Fragment key={i}>
                                                        <dt>{opt.label}</dt>
                                                        <dd>{opt.value}</dd>
                                                    </React.Fragment>
                                                ))}
                                            </dl>
                                        )}
                                    </td>
                                    <td className="col sku align-top py-3 px-2.5" data-th="SKU">
                                        {item.product_sku}
                                    </td>
                                    <td className="col price text-right align-top py-3 px-2.5" data-th="Price">
                                        <span className="price-including-tax" data-label="Incl. Tax">
                                            <span className="cart-price">
                                                <span className="price">{currency} {item.product_sale_price?.value?.toFixed(2)}</span>
                                            </span>
                                        </span>
                                    </td>
                                    <td className="col qty text-right align-top py-3 px-2.5" data-th="Qty">
                                        <ul className="items-qty">
                                            <li className="item">
                                                <span className="content">
                                                    {item.quantity_ordered}
                                                </span>
                                            </li>
                                        </ul>
                                    </td>
                                    <td className="col subtotal text-right align-top py-3 px-2.5" data-th="Subtotal">
                                        <span className="price-including-tax" data-label="Incl. Tax">
                                            <span className="cart-price">
                                                <span className="price">{currency} {(item.product_sale_price?.value * item.quantity_ordered).toFixed(2)}</span>
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className='text-right'>
                            <tr className="subtotal">
                                <th colSpan="4" className="mark py-1 px-2.5 pt-2.5" scope="row">
                                    Subtotal
                                </th>
                                <td className="amount py-1 px-2.5 pt-2.5" data-th="Subtotal">
                                    <span className="price">{currency} {subtotal.toFixed(2)}</span>
                                </td>
                            </tr>
                            <tr className="shipping">
                                <th colSpan="4" className="mark py-1 px-2.5" scope="row">
                                    Shipping &amp; Handling
                                </th>
                                <td className="amount py-1 px-2.5" data-th="Shipping &amp; Handling">
                                    <span className="price">{currency} {shipping.toFixed(2)}</span>
                                </td>
                            </tr>
                            <tr className="totals-tax">
                                <th colSpan="4" className="mark py-1 px-2.5" scope="row">
                                    Tax
                                </th>
                                <td className="amount py-1 px-2.5" data-th="Tax">
                                    <span className="price">{currency} {tax.toFixed(2)}</span>
                                </td>
                            </tr>
                            <tr className="grand_total">
                                <th colSpan="4" className="mark py-1 px-2.5" scope="row">
                                    <strong>Grand Total</strong>
                                </th>
                                <td className="amount py-1 px-2.5" data-th="Grand Total">
                                    <strong><span className="price">{currency} {grandTotal.toFixed(2)}</span></strong>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className='md_hidden'>
                    <div className="orderDetails-orderTotalContainer-6or m-0 max-w-none min-w-none lg_m-auto lg_max-w-[25rem] lg_min-w-[22rem]">
                        <div className='product-list p-4'>
                            {items.map((item, idx) => (
                                <div key={item.id || idx} className='order-item flex flex-col gap-2 pb-4 border-b border-gray-150 even_pt-2'>
                                    <Link to={"/product/" + item.product_sku}>
                                        <span>
                                            {item.product_name}
                                        </span>
                                    </Link>
                                    <div className='flex gap-2'>
                                        <span className='font-semibold'>
                                            {item.quantity_ordered} X {currency} {item.product_sale_price?.value?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 pt-0 border-0 gap-xs grid py-xs rounded-none lg_border lg_border-solid lg_border-gray-100 lg_p-xs lg_rounded-md">
                            <div className="orderTotal-subTotal-Eyf gap-xs grid grid-cols-autoLast"><span>Subtotal</span><span>{currency} {subtotal.toFixed(2)}</span></div>
                            <div className="orderTotal-tax-DF0 gap-xs grid grid-cols-autoLast"><span>Tax</span><span>{currency} {tax.toFixed(2)}</span></div>
                            <div className="orderTotal-shipping-dXC gap-xs grid grid-cols-autoLast"><span>Shipping</span><span>{currency} {shipping.toFixed(2)}</span></div>
                            <div className="orderTotal-total-s5t font-bold gap-xs grid grid-cols-autoLast"><span>Total</span><span>{currency} {grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemsOrdered;