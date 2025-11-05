import React, { useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Button from '@magento/venia-ui/lib/components/Button';
import cn from 'classnames';
import { Printer } from 'iconsax-react';
import ItemsOrdered from './components/itemsOrdered';
import RMAList from './components/rmaList';
import { useLocation } from 'react-router-dom';

const OrderDetail = (props) => {
    const printRef = useRef(null);
    const { formatMessage } = useIntl();
    const location = useLocation();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextRMADetail',
        defaultMessage: 'Order Detail'
    });

    // Retrieve order data from props or location state
    const order = props.order || location.state?.order;
    // Extract order data
    const invoiceNumber = order?.invoices?.[0]?.number || '-';
    const orderDate = order?.order_date
        ? new Date(order.order_date.replace(' ', 'T')).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : '-';
    const status = order?.status || '-';
    const shippingMethod = order?.shipping_method || '-';
    const trackingNumber = order?.shipments?.[0]?.tracking?.[0]?.number || '-';
    const shippingAddress = order?.shipping_address;
    const billingAddress = order?.billing_address;
    const paymentMethod = order?.payment_methods?.[0]?.type || '-';

    // Format address helper
    const formatAddress = addr => {
        if (!addr) return '-';
        return [
            `${addr.firstname} ${addr.lastname}`,
            ...(addr.street || []),
            `${addr.city}${addr.region_id ? ', ' + addr.region_id : ''}${addr.postcode ? ', ' + addr.postcode : ''}`,
            addr.country_code,
            addr.telephone ? `T: ${addr.telephone}` : ''
        ].filter(Boolean).join('\n');
    };

        const handlePrint = useCallback(() => {
            const styleId = 'order-detail-print-style';
            let style = document.getElementById(styleId);
            if (!style) {
                style = document.createElement('style');
                style.id = styleId;
                style.type = 'text/css';
                style.media = 'print';
                style.appendChild(document.createTextNode(`
                    @page { size: A3; margin: 0; }
                    @media print {
                        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        body * { visibility: hidden !important; }
                        .print-area, .print-area * { visibility: visible !important; }
                        .print-area { position: relative; left: 0; top: -20px; width: 100%;}
                        .no-print { display: none !important; }
                    }
                `));
                document.head.appendChild(style);
            }
            window.print();
            setTimeout(() => {
            }, 500);
        }, []);

    return (
        <div className='print-area relative grid gap-y-md' ref={printRef}>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left">
                {PAGE_TITLE} - #{order?.number || '-'}
            </div>
            <div className='block relative'>
                <div className='flex gap-2 mb-4 flex-col'>
                    <div className="box box-order-shipping-method flex gap-4">
                        <p className="box-title block min-w-[90px] font-semibold text-[14px]">
                            <span>Invoice</span>
                        </p>
                        <div className="box-content text-[14px]">
                            {invoiceNumber || '-'}
                        </div>
                    </div>
                    <div className="box box-order-shipping-method flex gap-4 text-[14px]">
                        <p className="box-title block min-w-[90px] font-semibold">
                            <span>Order Date</span>
                        </p>
                        <div className="box-content text-[14px]">
                            {orderDate}
                        </div>
                    </div>
                    <div className="box box-order-shipping-method flex gap-4 text-[14px]">
                        <p className="box-title block min-w-[90px] font-semibold self-center">
                            <span>Status</span>
                        </p>
                        <div className="box-content text-[14px]">
                            <div className='p-1 bg-[#F1EFF6] rounded-md flex items-center px-5'>
                                <p className='text-[14px] text-blue-700 flex justify-between'>
                                    <span className='font-medium block text-blue-700'>
                                        {status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md_flex-row gap-x-4 justify-end no-print'>
                    <Button
                        priority='high'
                        classes={{
                            content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                        }}
                        className={cn(
                            "bg-white px-6 py-2 rounded-md text-gray-900 hover_!text-white border border-solid",
                            "border-gray-900 focus-visible_outline-none hover_bg-gray-900 min-h-[40px]"
                        )}
                        onClick={handlePrint}
                        aria-label={formatMessage({ id: 'order.printInvoices', defaultMessage: 'Print Invoices' })}
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
            <div className="block block-order-details-view">
                <div aria-live="polite" className="text-lg font-medium text-left mb-4 block-title">
                    {
                        formatMessage({
                            id: 'order.productInfomarion',
                            defaultMessage: 'Product Information'
                        })
                    }
                </div>
                <ItemsOrdered order={order} />
            </div>
            <div className="block block-order-details-view">
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
            <div className="block block-order-details-view">
                <div aria-live="polite" className="text-lg font-medium text-left mb-4 block-title">
                    {
                        formatMessage({
                            id: 'order.OrderInformation',
                            defaultMessage: 'Order Information'
                        })
                    }
                </div>
                <div className="block-content flex flex-col gap-y-4 rounded-md border border-gray-100 px-4 py-6 justify-between gap-x-10">
                    <div className="box box-order-shipping-method flex gap-4">
                        <strong className="box-title block min-w-[140px]">
                            <span>Shipping Method</span>
                        </strong>
                        <div className="box-content">
                            {shippingMethod}
                        </div>
                    </div>
                    <div className="box box-order-shipping-method flex gap-4">
                        <strong className="box-title block min-w-[140px]">
                            <span>Tracking Number</span>
                        </strong>
                        <div className="box-content">
                            {trackingNumber}
                        </div>
                    </div>
                    <div className="box box-order-shipping-address flex gap-4">
                        <strong className="box-title block min-w-[140px]"><span>Shipping Address</span></strong>
                        <div className="box-content">
                            <div className='whitespace-pre-wrap'>
                                {formatAddress(shippingAddress)}
                            </div>
                        </div>
                    </div>
                    <div className="box box-order-billing-method flex gap-4">
                        <strong className="box-title block min-w-[140px]">
                            <span>Payment Method</span>
                        </strong>
                        <div className="box-content">
                            <dl className="payment-method checkmemo">
                                <dt className="title">{paymentMethod}</dt>
                            </dl>
                        </div>
                    </div>
                    <div className="box box-order-billing-address flex gap-4">
                        <strong className="box-title block min-w-[140px]">
                            <span>Billing Address</span>
                        </strong>
                        <div className="box-content">
                            <div className='whitespace-pre-wrap'>
                                {formatAddress(billingAddress)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>           
        </div>
    );
};

export default OrderDetail;