import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Image from '@magento/venia-ui/lib/components/Image';
import { Link, useParams, useLocation } from 'react-router-dom';
import Button from '@magento/venia-ui/lib/components/Button';
import ChatContent from '../LiveChat/chatContent';
import cn from 'classnames';
import { Send } from 'iconsax-react';
import Price from '@magento/venia-ui/lib/components/Price';
import { useRFQ } from '@riosst100/pwa-marketplace/src/talons/RFQ/useRFQ';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const quoteDetail = () => {
    const { formatMessage } = useIntl();
    const { urlKey } = useParams();
    const location = useLocation();
    const locationRfq = location && location.state && location.state.rfq ? location.state.rfq : null;
    const { loadRfqDetail, rfqDetailState, handleSendRfqMessage, startDetailPolling, stopDetailPolling, handleConvertQuickrfqToCart } = useRFQ();
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState(null);
    const detailData = rfqDetailState && rfqDetailState.data ? rfqDetailState.data.quickrfqDetail : null;
    const detailLoading = rfqDetailState ? rfqDetailState.loading : false;
    const detailError = rfqDetailState ? rfqDetailState.error : null;
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextQuoteDetail',
        defaultMessage: 'Quote Detail'
    });

    // prefer image from info_buy_request if available; otherwise use placeholder
    const urlImage = 'https://pwa-tcgcollective.local:8255/media/catalog/product/s/-/s-l1600_6__1.jpg?auto=webp&format=pjpg&width=495&height=618.75&fit=cover';

    useEffect(() => {
        if (!locationRfq) {
            const fromParam = urlKey ? parseInt(urlKey, 10) : NaN;
            const fromData = detailData && detailData.quickrfq_id
                ? (typeof detailData.quickrfq_id === 'number' ? detailData.quickrfq_id : parseInt(detailData.quickrfq_id, 10))
                : NaN;
            const finalId = !isNaN(fromParam) ? fromParam : fromData;
            if (!isNaN(finalId)) {
                loadRfqDetail({ quickrfqId: finalId });
            }
        }
    }, [urlKey, detailData, locationRfq, loadRfqDetail]);

    // start polling messages every 5s while on detail page; stop on unmount
    useEffect(() => {
        if (typeof startDetailPolling === 'function' && typeof stopDetailPolling === 'function') {
            startDetailPolling(5000);
            return () => stopDetailPolling();
        }
    }, [startDetailPolling, stopDetailPolling]);

    const rfq = locationRfq || detailData || {};
    const quickrfqIdValue = rfq && rfq.quickrfq_id
        ? (typeof rfq.quickrfq_id === 'number' ? rfq.quickrfq_id : parseInt(rfq.quickrfq_id, 10))
        : (urlKey ? parseInt(urlKey, 10) : null);
    const [isConverting, setIsConverting] = useState(false);
    const [convertError, setConvertError] = useState(null);
    const [convertSuccess, setConvertSuccess] = useState(null);
    const status = rfq && rfq.status ? rfq.status : '-';
    const quantity = rfq && rfq.quantity ? rfq.quantity : '-';
    const pricePerProduct = rfq && rfq.price_per_product ? rfq.price_per_product : null;
    const productName = rfq && rfq.product_name ? rfq.product_name : '-';
    const currency = pricePerProduct && pricePerProduct.currency ? pricePerProduct.currency : (rfq && rfq.store_currency_code ? rfq.store_currency_code : '');
    const unitValue = pricePerProduct && typeof pricePerProduct.value === 'number' ? pricePerProduct.value : null;
    const qtyNumber = typeof quantity === 'number' ? quantity : (typeof quantity === 'string' ? parseFloat(quantity) : 0);
    const expectedTotal = unitValue !== null && !isNaN(qtyNumber) ? unitValue * qtyNumber : null;
    // admin suggested fields
    const adminQtyRaw = rfq && rfq.admin_quantity != null ? rfq.admin_quantity : null;
    const adminQtyNumber = typeof adminQtyRaw === 'number' ? adminQtyRaw : (typeof adminQtyRaw === 'string' ? parseFloat(adminQtyRaw) : null);
    const adminPrice = rfq && rfq.admin_price ? rfq.admin_price : null;
    const adminCurrency = adminPrice && adminPrice.currency ? adminPrice.currency : currency;
    const adminUnitValue = adminPrice && typeof adminPrice.value === 'number' ? adminPrice.value : null;
    const adminTotal = adminUnitValue !== null && adminQtyNumber !== null && !isNaN(adminQtyNumber) ? adminUnitValue * adminQtyNumber : null;
    const contactName = rfq && rfq.contact_name ? rfq.contact_name : '-';
    const email = rfq && rfq.email ? rfq.email : '-';
    const phone = rfq && rfq.phone ? rfq.phone : '-';
    const dateNeedQuote = rfq && rfq.date_need_quote ? rfq.date_need_quote : '-';
    const couponCode = rfq && rfq.coupon_code ? rfq.coupon_code : '-';
    const sellerName = rfq && rfq.seller_name ? rfq.seller_name : '-';
    const expiryDate = rfq && rfq.expiry ? rfq.expiry : '-';

    const isInitialLoading = detailLoading && !detailData;
    if (isInitialLoading && !locationRfq) {
        return <LoadingIndicator />;
    }

    if (detailError && !locationRfq) {
        return (
            <div className="p-4">
                <div className="text-red-600 text-sm">
                    {formatMessage({ id: 'Quotes.detailError', defaultMessage: 'Failed to load quote detail.' })}
                </div>
            </div>
        );
    }

    // map backend messages to ChatContent shape using customer_id
    const chatData = Array.isArray(rfq && rfq.messages)
        ? rfq.messages.map(m => ({
              message: m && m.message ? m.message : '',
              type: m && m.customer_id === 0 ? 'seller' : 'buyer',
              timeStamp: m && m.created_at ? m.created_at : ''
          }))
        : [];

    return (
        <div className='relative grid gap-y-md'>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left">
                {PAGE_TITLE} - #{quickrfqIdValue}
            </div>
            <div className='rounded-md border border-gray-100 px-4 py-6 flex flex-col-reverse md_flex-row justify-between gap-x-10'>
                <div className='flex flex-col gap-y-4 w-full md_w-6/12'>
                    <div className='block p-2 -ml-2 -mr-2 bg-[#F1EFF6] rounded-md'>
                        <p className='text-[13px] text-blue-700 flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.labelStatus',
                                        defaultMessage: 'Quote Status'
                                    })
                                }
                            </span>
                            <span className='font-medium block text-blue-700'>
                                {status}
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.labelQty',
                                        defaultMessage: 'Quantity'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {quantity} Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminSuggestedQty',
                                        defaultMessage: 'Admin Suggested Quantity'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {adminQtyNumber !== null && !isNaN(adminQtyNumber) ? adminQtyNumber : '-'} Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.expectedPrice',
                                        defaultMessage: 'Expected Price'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {unitValue !== null ? (
                                    <>
                                        <Price currencyCode={currency} value={unitValue} /> {' '} Per Unit
                                    </>
                                ) : (
                                    '-'
                                )}
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminSuggestedPrice',
                                        defaultMessage: 'Admin Suggested Price'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {adminUnitValue !== null ? (
                                    <>
                                        <Price currencyCode={adminCurrency} value={adminUnitValue} /> {' '} Per Unit
                                    </>
                                ) : (
                                    '-'
                                )}
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.expectedTotal',
                                        defaultMessage: 'Expected Total'
                                    })
                                }
                            </span>
                            <span className='font-medium block'>
                                {expectedTotal !== null ? (
                                    <Price currencyCode={currency} value={expectedTotal} />
                                ) : (
                                    '-'
                                )} {' '} Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminSuggestedTotal',
                                        defaultMessage: 'Admin Suggested Total'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {adminTotal !== null ? (
                                    <Price currencyCode={adminCurrency} value={adminTotal} />
                                ) : (
                                    '-'
                                )} {' '} Units
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.adminAddedCouponCode',
                                        defaultMessage: 'Admin Added Coupon Code'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {couponCode}
                            </span>
                        </p>
                        <small className='text-[10px] text-gray-600'>
                            {
                                formatMessage({
                                    id: 'Quotes.couponCodeNotes',
                                    defaultMessage: 'You can apply coupon code when checkout order for this quote'
                                })
                            }
                        </small>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.seller',
                                        defaultMessage: 'Seller'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {sellerName}
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.dateNeedQuote',
                                        defaultMessage: 'Date Need Quote'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {dateNeedQuote}
                            </span>
                        </p>
                    </div>
                    <div className='block'>
                        <p className='text-[13px] text-colorDefault flex justify-between'>
                            <span className='font-medium block'>
                                {
                                    formatMessage({
                                        id: 'Quotes.expiryDateForOrder',
                                        defaultMessage: 'Expiry Date For Create Order'
                                    })
                                }
                            </span>
                            <span className='font-normal block'>
                                {expiryDate}
                            </span>
                        </p>
                    </div>
                </div>
                <div className='relative flex w-full md_w-6/12 justify-center flex-col mb-10 md_mb-0'>
                    <Image
                        alt='product image'
                        className="relative max-w-[300px]"
                        src={urlImage}
                        classes={{
                            root: ' relative self-center mb-5'
                        }}
                    />
                    <p className='text-[16px] font-medium text-colorDefault text-center'>
                        {unitValue !== null ? (
                            <Price currencyCode={currency} value={unitValue} />
                        ) : (
                            '-'
                        )}
                    </p>
                    <div className="max-w-[360px] self-center mb-5 text-center">
                        <span className=" text-[13px] block font-medium text-colorDefault w-full">
                            {productName}
                        </span>
                    </div>
                    <Button
                        priority='high'
                        classes={{
                            content: 'capitalize text-[16px] font-medium'
                        }}
                        disabled={isConverting || !quickrfqIdValue || isNaN(quickrfqIdValue)}
                        aria-busy={isConverting}
                        onPress={async () => {
                            const qid = quickrfqIdValue;
                            if (!qid || isNaN(qid)) return;
                            try {
                                setConvertError(null);
                                setConvertSuccess(null);
                                setIsConverting(true);
                                const res = await handleConvertQuickrfqToCart(qid);
                                const payload = res && res.data && res.data.convertQuickrfqToCart ? res.data.convertQuickrfqToCart : null;
                                if (payload && payload.status) {
                                    setConvertSuccess(payload.message || 'Converted to cart.');
                                } else {
                                    setConvertError('Failed to convert quote to cart.');
                                }
                            } catch (e) {
                                setConvertError('Failed to convert quote to cart.');
                            } finally {
                                setIsConverting(false);
                            }
                        }}
                    >
                        {isConverting
                            ? formatMessage({ id: 'Quotes.converting', defaultMessage: 'Add To Cart…' })
                            : formatMessage({ id: 'Quotes.addToCart', defaultMessage: 'Add To Cart' })}
                    </Button>
                    {convertError ? (
                        <div className='text-red-600 text-[12px] mt-2 text-center'>{convertError}</div>
                    ) : null}
                    {convertSuccess ? (
                        <div className='text-green-600 text-[12px] mt-2 text-center'>{convertSuccess}</div>
                    ) : null}
                </div>
            </div>
            <div className=' flex flex-col mb-10'>
                <div aria-live="polite" className="text-lg font-medium text-left mb-4">
                    Messages
                </div>
                <div className='rounded-md border border-gray-100 p-4 pr-0 pt-0 flex flex-col gap-y-6'>
                    <div className='max-h-[600px] overflow-auto relative chat-container pr-4 pt-4'>
                        <ChatContent chatData={chatData} />
                    </div>
                    <div className='flex gap-2 pr-4'>
                        <textarea
                            className='w-full focus-visible_outline-none border border-gray-100 p-1 rounded-md'
                            cols={5}
                            value={messageText}
                            onChange={e => setMessageText(e.target.value)}
                        />
                        <Button
                            priority='high'
                            classes={{
                                content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                            }}
                            className={cn(
                                "px-6 py-2 rounded-full text-white border focus-visible_outline-none",
                                isSending
                                    ? "bg-gray-400 border-gray-400"
                                    : "bg-blue-600 border-blue-600 hover_bg-blue-700 hover_border-blue-700"
                            )}
                            disabled={isSending || !(messageText || '').trim()}
                            aria-busy={isSending}
                            onPress={async () => {
                                const qid = quickrfqIdValue;
                                const msg = (messageText || '').trim();
                                if (!qid || isNaN(qid) || msg.length === 0) {
                                    return;
                                }
                                try {
                                    setSendError(null);
                                    setIsSending(true);
                                    await handleSendRfqMessage({ quickrfq_id: qid, message: msg });
                                    setMessageText('');
                                    await loadRfqDetail({ quickrfqId: qid });
                                } catch (err) {
                                    setSendError('Failed to send message.');
                                } finally {
                                    setIsSending(false);
                                }
                            }}
                        >
                            {isSending ? (
                                <span className='text-white text-[14px]'>Sending…</span>
                            ) : (
                                <Send size="24" className='text-white' />
                            )}
                        </Button>
                        {sendError ? (
                            <span className='text-red-600 text-[12px] self-center'>{sendError}</span>
                        ) : null}
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

export default quoteDetail