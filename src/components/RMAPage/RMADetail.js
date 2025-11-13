import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Image from '@magento/venia-ui/lib/components/Image';
import { Link, useParams } from 'react-router-dom';
import Button from '@magento/venia-ui/lib/components/Button';
import ChatContent from '../LiveChat/chatContent';
import cn from 'classnames';
import { Send, Printer } from 'iconsax-react';
import useRmaPage from '@riosst100/pwa-marketplace/src/talons/RMAPage/useRmaPage';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import { CheckCircle as CheckCircleIcon } from 'react-feather';

const RMADetail = () => {
    const { formatMessage } = useIntl();
    const { urlKey } = useParams();
    const rmaId = urlKey;
    const {
        rmaDetail,
        rmaDetailLoading,
        rmaDetailError,
        confirmShipping,
        confirmShippingLoading,
        confirmShippingError,
        confirmShippingData,
        refetchRmaDetail,
        sendRmaMessage,
        sendRmaMessageLoading,
        sendRmaMessageError,
        sendRmaMessageData
    } = useRmaPage({ rmaId });
    const [, { addToast }] = useToasts();
    // State untuk input chat
    const [chatInput, setChatInput] = useState('');
    const [chatSending, setChatSending] = useState(false);
    // Handler kirim pesan chat
    const handleSendChat = useCallback(async () => {
        if (!chatInput.trim()) return;
        setChatSending(true);
        const input = {
            rma_id: rmaId,
            text: chatInput.trim()
        };
        const { data, error } = await sendRmaMessage(input);
        setChatSending(false);
        if (error || !data?.lofmpSendRmaMessage?.success) {
            addToast({
                type: 'error',
                message: (data?.lofmpSendRmaMessage?.message || error?.message || 'Failed to send message'),
                dismissable: true,
                timeout: 4000
            });
            return;
        }
        setChatInput('');
        if (typeof refetchRmaDetail === 'function') refetchRmaDetail();
    }, [chatInput, rmaId, sendRmaMessage, addToast, refetchRmaDetail]);
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextRMADetail',
        defaultMessage: 'Return Detail'
    });

    const chatData = useMemo(() => {
        const messages = (rmaDetail && rmaDetail.messages) ? rmaDetail.messages : [];
        const email = rmaDetail && rmaDetail.shipping_address && rmaDetail.shipping_address.email;
        const mapped = messages.map(m => ({
            message: m.text,
            type: email && m.sender_email === email ? 'buyer' : 'seller',
            timeStamp: m.created_at,
            senderName: m.sender_name || ''
        }));
        return mapped.length > 0 ? mapped : dummyChat;
    }, [rmaDetail]);

    const formatted = useMemo(() => {
        if (!rmaDetail) return {};
        const toDate = (d) => {
            if (!d) return '';
            const iso = d.replace(' ', 'T');
            const dt = new Date(iso);
            if (isNaN(dt.getTime())) return d;
            return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        };
        return {
            status: rmaDetail.status_label || rmaDetail.status,
            increment_id: rmaDetail.increment_id || rmaDetail.increment_id,
            rmaNumber: rmaDetail.increment_id || rmaDetail.rma_id,
            orderNumber: rmaDetail.order && rmaDetail.order.increment_id ? rmaDetail.order.increment_id : '-',
            orderDate: rmaDetail.order && rmaDetail.order.created_at ? toDate(rmaDetail.order.created_at) : '',
            dateRequested: rmaDetail.rma_date ? toDate(rmaDetail.rma_date) : '',
            shipping: rmaDetail.shipping_address,
            items: rmaDetail.items || [],
            rawStatus: rmaDetail.status_label, 
        };
    }, [rmaDetail]);
    // Use same in-page print approach as OrderDetail: CSS hides everything except .print-area
    const printRef = useRef(null);
    const handlePrint = useCallback(() => {
        const styleId = 'rma-detail-print-style';
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.type = 'text/css';
            style.media = 'print';
            style.appendChild(document.createTextNode(`
                @page { size: A4; margin: 0; }
                @media print {
                    body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    body * { visibility: hidden !important; }
                    .print-area, .print-area * { visibility: visible !important; }
                    .print-area { position: relative; left: 0; top: -20px; width: 100%; }
                    .no-print { display: none !important; }
                }
            `));
            document.head.appendChild(style);
        }
        window.print();
    }, []);

    // Show toast and refetch on confirm shipping success
    useEffect(() => {
        if (
            confirmShippingData &&
            confirmShippingData.lofmpRmaShippingConfirm &&
            confirmShippingData.lofmpRmaShippingConfirm.success
        ) {
            const message = confirmShippingData.lofmpRmaShippingConfirm.message || 'Shipping confirmed!';
            addToast({
                type: 'success',
                icon: <CheckCircleIcon size={18} />,
                message,
                dismissable: true,
                timeout: 4000
            });
            if (typeof refetchRmaDetail === 'function') refetchRmaDetail();
        }
    }, [confirmShippingData, refetchRmaDetail, addToast]);

    return (
    <div className='print-area relative grid gap-y-md' ref={printRef}>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left">
                {PAGE_TITLE} {formatted.increment_id ? `#${formatted.increment_id}` : ''}
            </div>
            <div className='block relative'>
                {(formatted.rawStatus === 'Approved' || formatted.rawStatus === 'approved') && (
                    <div className='flex flex-col gap-y-2 mb-2 no-print'>
                        <div className='flex gap-x-4 justify-end'>
                            <Button
                                priority='high'
                                classes={{
                                    content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                                }}
                                className={cn(
                                    "bg-white px-6 py-2 rounded-md text-gray-900 hover_!text-white border border-solid",
                                    "border-gray-900 focus-visible_outline-none hover_bg-gray-900"
                                )}
                                onClick={handlePrint}
                            >
                                <span className='flex gap-x-3 justify-center group-hover_!text-white'>
                                    <Printer
                                        size="24"
                                        className=''
                                    />
                                    {
                                        formatMessage({
                                            id: 'RMA.printRMAPackingSlip',
                                            defaultMessage: 'Print RMA Packing Slip'
                                        })
                                    }
                                </span>
                            </Button>

                            <Button
                                priority='high'
                                classes={{
                                    content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                                }}
                                className={cn(
                                    "bg-blue-600 px-6 py-2 rounded-md text-white border ",
                                    "border-blue-600 hover_bg-blue-700 hover_border-blue-700 focus-visible_outline-none"
                                )}
                                onClick={async () => {
                                    if (!confirmShippingLoading) await confirmShipping(Number(rmaId));
                                }}
                                disabled={confirmShippingLoading}
                            >
                                <span className='flex gap-x-3 justify-center'>
                                    {confirmShippingLoading
                                        ? formatMessage({ id: 'RMA.confirmShippingLoading', defaultMessage: 'Processing...' })
                                        : formatMessage({ id: 'RMA.confirmShipping', defaultMessage: 'Confirm Shipping' })
                                    }
                                </span>
                            </Button>
                        </div>
                        {confirmShippingError && (
                            <div className='text-[13px] text-red-600 text-right'>
                                {confirmShippingError.message}
                            </div>
                        )}
                        {confirmShippingData && confirmShippingData.lofmpRmaShippingConfirm && !confirmShippingData.lofmpRmaShippingConfirm.success && (
                            <div className='text-[13px] text-red-600 text-right'>
                                {confirmShippingData.lofmpRmaShippingConfirm.message}
                            </div>
                        )}
                    </div>
                )}
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
                                            defaultMessage: 'Status Return'
                                        })
                                    }
                                </span>
                                <span className='font-medium block text-blue-700'>
                                    {formatted.status || '-'}
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
                                    {formatted.rmaNumber || '-'}
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
                                    {`${formatted.orderNumber || '-'}${formatted.orderDate ? ` at ${formatted.orderDate}` : ''}`}
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
                                    {formatted.dateRequested || '-'}
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
                                {
                                    formatted.shipping
                                        ? `${formatted.shipping.firstname || ''} ${formatted.shipping.lastname || ''}\n` +
                                          `${formatted.shipping.email || ''}\n` +
                                          `${formatted.shipping.telephone || ''}\n` +
                                          `${formatted.shipping.street || ''}\n` +
                                          `${formatted.shipping.city || ''}\n` +
                                          `${formatted.shipping.region || ''}\n` +
                                          `${formatted.shipping.country_id || ''}\n`
                                        : ''
                                }
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
                    {!rmaDetailLoading && formatted.items && formatted.items.length === 0 && (
                        <div className='text-[13px] text-colorDefault'>No items</div>
                    )}
                    {!rmaDetailLoading && formatted.items && formatted.items.map((it, idx) => (
                        <div key={it.id || idx} className='flex gap-4 items-start'>
                            <div className='w-[70px] h-[70px] overflow-hidden rounded-md bg-gray-50 flex items-center justify-center'>
                                {it.image_url ? (
                                    <img src={it.image_url} alt={it.name} width={70} height={70} />
                                ) : (
                                    <div className='text-[10px] text-gray-400'>No Image</div>
                                )}
                            </div>
                            <div className='flex flex-col text-[13px]'>
                                <span className='font-medium'>{it.name}</span>
                                <span>SKU : {it.sku || '-'}</span>
                                <span>Qty : {it.qty_requested || 0}</span>
                                <span>Reason : {it.reason || '-'}</span>
                                <span>Resolution : {it.resolution || '-'}</span>
                                <span>Condition : {it.condition || '-'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className=' flex flex-col mb-10 no-print'>
                <div aria-live="polite" className="text-lg font-medium text-left mb-4">
                    Messages
                </div>
                <div className='rounded-md border border-gray-100 p-4 pr-0 pt-0 flex flex-col gap-y-6'>
                    <div className='max-h-[600px] overflow-auto relative chat-container pr-4 pt-4'>
                        {rmaDetailError ? (
                            <div className='text-[13px] text-red-600'>Failed to load messages.</div>
                        ) : (
                            <ChatContent chatData={chatData} />
                        )}
                    </div>
                    <div className='flex gap-2 pr-4'>
                        <textarea
                            className='w-full focus-visible_outline-none border border-gray-100 p-1 rounded-md'
                            cols={5}
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            placeholder={formatMessage({ id: 'RMA.chatPlaceholder', defaultMessage: 'Type your message...' })}
                            disabled={chatSending || sendRmaMessageLoading}
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
                            onClick={handleSendChat}
                            disabled={chatSending || sendRmaMessageLoading || !chatInput.trim()}
                            aria-label={formatMessage({ id: 'RMA.sendMessage', defaultMessage: 'Send Message' })}
                        >
                            {chatSending || sendRmaMessageLoading ? (
                                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send
                                    size="24"
                                    className='text-white'
                                />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <style jsx="true">
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

export default RMADetail;