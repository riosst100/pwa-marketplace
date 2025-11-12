import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRmaPage } from '@riosst100/pwa-marketplace/src/talons/RMAPage/useRmaPage';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Button from '@magento/venia-ui/lib/components/Button';
import ChatContent from '../LiveChat/chatContent';
import cn from 'classnames';
import { Send } from 'iconsax-react';
import Item from './components/productItem';
import { useQuery } from '@apollo/client';
import { GET_LOFMP_RMA_CONFIGURATIONS } from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/RMAPage/rmaPage.gql';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import { CheckCircle as CheckCircleIcon, AlertCircle as AlertCircleIcon } from 'react-feather';

const RMACreate = () => {
    const location = useLocation();
    const history = useHistory();
    let order = location.state && location.state.order;
    if (!order) {
        try {
            order = JSON.parse(localStorage.getItem('rma_order'));
        } catch (e) {
            order = undefined;
        }
    }

    const {
        createRma,
        createRmaLoading,
        createRmaError,
        createRmaData
    } = useRmaPage();

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [, { addToast }] = useToasts();

    // State untuk setiap item yang di-checklist
    const [itemReturnState, setItemReturnState] = useState({});

    // Ambil konfigurasi RMA (reasons, conditions, resolutions)
    const { data: rmaConfigData } = useQuery(GET_LOFMP_RMA_CONFIGURATIONS);

    // Handler untuk update state per item
    const handleItemChange = (itemId, field, value) => {
        setItemReturnState(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    // Handler untuk checklist item
    const handleItemCheck = (itemId, checked) => {
        setItemReturnState(prev => {
            const current = prev[itemId] || {};
            // Set default values when checked true
            let defaults = {};
            if (checked) {
                const cfg = rmaConfigData && rmaConfigData.lofmpRmaConfigurations;
                const firstReason = cfg && cfg.reasons && cfg.reasons.length > 0 ? cfg.reasons[0].id : null;
                const firstCondition = cfg && cfg.conditions && cfg.conditions.length > 0 ? cfg.conditions[0].id : null;
                const firstResolution = cfg && cfg.resolutions && cfg.resolutions.length > 0 ? cfg.resolutions[0].id : null;
                defaults = {
                    qty_requested: current.qty_requested != null ? current.qty_requested : 1,
                    reason_id: current.reason_id != null ? current.reason_id : (firstReason != null ? firstReason : null),
                    condition_id: current.condition_id != null ? current.condition_id : (firstCondition != null ? firstCondition : null),
                    resolution_id: current.resolution_id != null ? current.resolution_id : (firstResolution != null ? firstResolution : null)
                };
            }
            return {
                ...prev,
                [itemId]: {
                    ...current,
                    ...defaults,
                    checked
                }
            };
        });
    };

    // Build input mutation sesuai struktur backend
    const buildRmaInput = () => {
        if (!order || !order.items) return null;
        // Ambil shipping address
        const shipping = order.shipping_address || {};
        // Ambil item yang dicentang dan sudah diisi field wajib
        const cfg = rmaConfigData && rmaConfigData.lofmpRmaConfigurations;
        const defReason = cfg && cfg.reasons && cfg.reasons[0] ? cfg.reasons[0].id : 0;
        const defCondition = cfg && cfg.conditions && cfg.conditions[0] ? cfg.conditions[0].id : 0;
        const defResolution = cfg && cfg.resolutions && cfg.resolutions[0] ? cfg.resolutions[0].id : 0;
        const items = order.items
            .filter(it => itemReturnState[it.id] && itemReturnState[it.id].checked)
            .map(it => {
                const st = itemReturnState[it.id] || {};
                let condition_id = parseInt(st.condition_id, 10);
                let qty_requested = parseFloat(st.qty_requested);
                let reason_id = parseInt(st.reason_id, 10);
                let resolution_id = parseInt(st.resolution_id, 10);
                if (isNaN(condition_id)) condition_id = defCondition;
                if (isNaN(qty_requested) || qty_requested <= 0) qty_requested = 1;
                if (isNaN(reason_id)) reason_id = defReason;
                if (isNaN(resolution_id)) resolution_id = defResolution;
                return {
                    order_item_id: it.id,
                    condition_id,
                    qty_requested,
                    reason_id,
                    resolution_id
                };
            });
        if (!items.length) return null;
        return {
            order_number: order.number || order.increment_id,
            items,
            city: shipping.city,
            country_id: shipping.country_code,
            postcode: shipping.postcode,
            region: shipping.region,
            street: Array.isArray(shipping.street) ? shipping.street.join(' ') : shipping.street
        };
    };

    const handleSubmit = async () => {
        setSubmitError(null);
        setSubmitSuccess(null);
        const input = buildRmaInput();
        if (!input) {
            setSubmitError('Pilih minimal 1 item dan lengkapi data.');
            return;
        }
       
        const { data, error } = await createRma(input);
        if (error) {
            const message = error.message || 'Failed to create RMA.';
            setSubmitError(message);
            addToast({
                type: 'error',
                icon: <AlertCircleIcon size={18} />,
                message,
                dismissable: true,
                timeout: 6000
            });
            return;
        }
        const payload = data && data.lofmpCreateRma;
        if (payload && payload.success) {
            const message = 'RMA request created successfully!';
            setSubmitSuccess(message);
            addToast({
                type: 'info',
                icon: <CheckCircleIcon size={18} />,
                message,
                dismissable: true,
                timeout: 4000
            });
            // Redirect to RMA list after brief delay (optional immediate)
            setTimeout(() => {
                history.push('/return');
            }, 400); // small delay for user feedback
        } else {
            const message = (payload && payload.message) || 'Failed to create RMA.';
            setSubmitError(message);
            addToast({
                type: 'error',
                icon: <AlertCircleIcon size={18} />,
                message,
                dismissable: true,
                timeout: 6000
            });
        }
    };
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextRMACreate',
        defaultMessage: 'New Return'
    });

    const dummyChat = [
        {
            "message": "May I help you",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "Yes",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "can i get a discount",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "you can redeem this code 'JunePlay'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "or this code 'collectfest'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "May I help you",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "Yes",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "can i get a discount",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "you can redeem this code 'JunePlay'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "or this code 'collectfest'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
    ]

    return (
        <div className='relative grid gap-y-md'>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left">
                {PAGE_TITLE} {order ? `- ${order.number || order.increment_id}` : ''}
            </div>
            <div className='block relative'>
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
                                            defaultMessage: 'Status Order'
                                        })
                                    }
                                </span>
                                <span className='font-medium block text-blue-700'>
                                    {order?.status}
                                </span>
                            </p>
                        </div>
                        <div className='block'>
                            <p className='text-[13px] text-colorDefault flex justify-between'>
                                <span className='font-medium block'>
                                    {formatMessage({ id: 'RMA.RMANumber', defaultMessage: 'RMA' })}
                                </span>
                                <span className='font-normal block'>
                                    {order ? order.increment_id || order.number : '-'}
                                </span>
                            </p>
                        </div>
                        <div className='block'>
                            <p className='text-[13px] text-colorDefault flex justify-between'>
                                <span className='font-medium block'>
                                    {formatMessage({ id: 'RMA.OrderNumber', defaultMessage: 'Order Number' })}
                                </span>
                                <span className='font-normal block'>
                                    {order ? order.number || order.increment_id : '-'}
                                    {order && order.order_date ? ` at ${new Date(order.order_date.replace(' ', 'T')).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}` : ''}
                                </span>
                            </p>
                        </div>
                        <div className='block'>
                            <p className='text-[13px] text-colorDefault flex justify-between'>
                                <span className='font-medium block'>
                                    {formatMessage({ id: 'RMA.dateRequested', defaultMessage: 'Date Requested' })}
                                </span>
                                <span className='font-normal block'>
                                    {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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
                                {order && order.shipping_address ? (
                                    <>
                                        {order.shipping_address.firstname} {order.shipping_address.lastname}{'\n'}
                                        {order.shipping_address.telephone}{'\n'}
                                        {order.shipping_address.street && Array.isArray(order.shipping_address.street) ? order.shipping_address.street.join(', ') : order.shipping_address.street}{'\n'}
                                        {order.shipping_address.city}{order.shipping_address.region ? ', ' + order.shipping_address.region : ''}{'\n'}
                                        {order.shipping_address.postcode}{'\n'}
                                        {order.shipping_address.country_code}
                                    </>
                                ) : (
                                    <>
                                        -
                                    </>
                                )}
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
                    {order && order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                            <Item
                                key={item.id || idx}
                                item={item}
                                order={order}
                                withCheckbox
                                rmaConfigData={rmaConfigData}
                                itemState={itemReturnState[item.id] || {}}
                                onItemChange={(field, value) => handleItemChange(item.id, field, value)}
                                onItemCheck={checked => handleItemCheck(item.id, checked)}
                            />
                        ))
                    ) : (
                        <span className='text-gray-400'>No items found.</span>
                    )}
                </div>
            </div>
            <div className=' flex flex-col mb-10'>
                <div aria-live="polite" className="text-lg font-medium text-left mb-4">
                    Messages
                </div>
                <div className='rounded-md border border-gray-100 p-4 pr-0 pt-0 flex flex-col gap-y-6'>
                    <div className='max-h-[600px] overflow-auto relative chat-container pr-4 pt-4'>
                        <ChatContent chatData={dummyChat} />
                    </div>
                    <div className='flex gap-2 pr-4'>
                        <textarea
                            className='w-full focus-visible_outline-none border border-gray-100 p-1 rounded-md'
                            cols={5}
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
                        >
                            <Send
                                size="24"
                                className='text-white'
                            />
                        </Button>
                    </div>
                </div>
                <div className='flex justify-end flex-row gap-4 mt-6 mb-4'>
                    <Button
                        priority='high'
                        onClick={handleSubmit}
                        disabled={createRmaLoading}
                        className={cn(
                            'px-6 py-2 rounded-full text-white border flex items-center gap-2',
                            createRmaLoading
                                ? 'bg-gray-400 border-gray-400 cursor-not-allowed'
                                : 'bg-blue-700 border-blue-700 hover_bg-blue-700 hover_border-blue-700',
                            'focus-visible_outline-none'
                        )}
                    >
                        {createRmaLoading && (
                            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {createRmaLoading ? 'Submitting...' : 'Submit RMA Request'}
                    </Button>
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

export default RMACreate;