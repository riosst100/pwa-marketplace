import React from 'react';
import Image from '@magento/venia-ui/lib/components/Image';
import { Link } from 'react-router-dom';
import Select from '@riosst100/pwa-marketplace/src/components/commons/Select';
import TextField from '@riosst100/pwa-marketplace/src/components/commons/Textfield';
import Checkbox from '@riosst100/pwa-marketplace/src/components/commons/Checkbox';


const productItem = (props) => {
    const {
        withCheckbox = false,
        item,
        order,
        rmaConfigData,
        itemState = {},
        onItemChange,
        onItemCheck
    } = props;

    let urlImage = undefined;
    if (item && typeof item.product_image === 'string' && item.product_image.length > 0) {
        urlImage = item.product_image;
    }

    const reasonOptions = rmaConfigData && rmaConfigData?.lofmpRmaConfigurations && rmaConfigData?.lofmpRmaConfigurations?.reasons
        ? rmaConfigData?.lofmpRmaConfigurations?.reasons.map(r => ({ value: r.id, label: r.name }))
        : [];
    const conditionOptions = rmaConfigData && rmaConfigData?.lofmpRmaConfigurations && rmaConfigData?.lofmpRmaConfigurations?.conditions
        ? rmaConfigData?.lofmpRmaConfigurations?.conditions.map(c => ({ value: c.id, label: c.name }))
        : [];
    const resolutionOptions = rmaConfigData && rmaConfigData?.lofmpRmaConfigurations && rmaConfigData?.lofmpRmaConfigurations?.resolutions
        ? rmaConfigData?.lofmpRmaConfigurations?.resolutions.map(res => ({ value: res.id, label: res.name }))
        : [];

    // Checkbox handler
    const handleCheck = (e) => {
        if (onItemCheck) onItemCheck(e.target.checked);
    };


    // Input change handler with qty_requested validation
    const handleFieldChange = (field, value) => {
        if (field === 'qty_requested' && item && item.quantity_ordered) {
            if (value > item.quantity_ordered) {
                value = item.quantity_ordered;
            }
            if (value < 1) {
                value = 1;
            }
        }
        if (onItemChange) onItemChange(field, value);
    };

    return (
        <>
            <div className='item flex flex-col lg_flex-row justify-between border border-gray-100 rounded-md p-4'>
                <div className='flex gap-4 w-full lg_w-3/5'>
                    {withCheckbox ? (
                        <Checkbox onChange={handleCheck} checked={!!itemState.checked} />
                    ) : null}

                    <div className='flex w-full gap-4'>
                        <div className='block'>
                            <Image
                                alt={item && item.product_name ? item.product_name : 'product image'}
                                className="relative max-w-[120px]"
                                src={urlImage}
                                classes={{
                                    root: ' relative self-center mb-5'
                                }}
                            />
                        </div>
                        <div className='flex flex-col gap-y-1 w-full md_w-6/12'>
                            <div className='block'>
                                <p className='text-[13px] text-colorDefault flex justify-between'>
                                    <span className='font-medium block'>
                                        {item && item.product_name ? item.product_name : '-'}
                                    </span>
                                </p>
                            </div>
                            <div className='block'>
                                <p className='text-[13px] text-gray-200 flex justify-between'>
                                    <span className='font-normal block'>
                                        Qty : {item && item.quantity_ordered ? item.quantity_ordered : '-'}
                                    </span>
                                </p>
                            </div>
                            <div className='block'>
                                <p className='text-[13px] text-gray-200 flex justify-between'>
                                    <span className='font-normal block'>
                                        {item && item.product_sale_price && item.product_sale_price.currency ? item.product_sale_price.currency : ''} {item && item.product_sale_price && item.product_sale_price.value ? item.product_sale_price.value : '-'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='block w-full lg_w-2/5'>
                    {!!itemState.checked ? (
                        <>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Qty Return
                                </p>
                                <TextField
                                    value={
                                        itemState.qty_requested > item.quantity_ordered
                                            ? item.quantity_ordered
                                            : itemState.qty_requested || ''
                                    }
                                    onChange={e => {
                                        let val = parseFloat(e.target.value);
                                        if (isNaN(val)) val = '';
                                        if (val > item.quantity_ordered) val = item.quantity_ordered;
                                        if (val < 1 && val !== '') val = 1;
                                        handleFieldChange('qty_requested', val);
                                    }}
                                    type="number"
                                    min={1}
                                    max={item.quantity_ordered}
                                />
                            </div>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Return Reason
                                </p>
                                <Select
                                    options={reasonOptions}
                                    className='w-full'
                                    value={itemState.reason_id !== undefined && itemState.reason_id !== null ? itemState.reason_id : ''}
                                    onChange={e => handleFieldChange('reason_id', e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Item Condition
                                </p>
                                <Select
                                    options={conditionOptions}
                                    className='w-full'
                                    value={itemState.condition_id !== undefined && itemState.condition_id !== null ? itemState.condition_id : ''}
                                    onChange={e => handleFieldChange('condition_id', e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Resolution
                                </p>
                                <Select
                                    options={resolutionOptions}
                                    className='w-full'
                                    value={itemState.resolution_id !== undefined && itemState.resolution_id !== null ? itemState.resolution_id : ''}
                                    onChange={e => handleFieldChange('resolution_id', e.target.value)}
                                />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default productItem