import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import Select from '@riosst100/pwa-marketplace/src/components/commons/Select';

const preOrderInfo = (props) => {
    const { className, preOrder, preOrderDate, preOrderDeposite, preOrderNote, preOrderPaymentType, releaseDate, onPaymentTypeChange, paymentTypeOptions = [] } = props;
    
    const isPreOrder = typeof preOrder === 'string'
        ? preOrder.trim().toLowerCase() === 'pre orders'
        : !!(preOrder && preOrder.is_preorder);

    const normalizePaymentType = (value = '') => {
        const normalized = value.toString().trim().toLowerCase();

        if (normalized === 'full payment') {
            return 'full';
        }

        if (normalized === 'deposit' || normalized === 'full') {
            return normalized;
        }

        return '';
    };

    const initialPaymentType = useMemo(
        () => normalizePaymentType(preOrderPaymentType),
        [preOrderPaymentType]
    );

    const [selectedPaymentType, setSelectedPaymentType] = useState(initialPaymentType || 'full');

    useEffect(() => {
        setSelectedPaymentType(initialPaymentType || 'full');
    }, [initialPaymentType]);

    // Propagate initial and subsequent selection to parent so submit has value
    useEffect(() => {
        if (typeof onPaymentTypeChange === 'function' && selectedPaymentType) {
            onPaymentTypeChange(selectedPaymentType);
        }
    }, [selectedPaymentType, onPaymentTypeChange]);

    const normalizedPaymentOptions = useMemo(() => {
        return paymentTypeOptions.reduce((acc, option) => {
            const normalizedValue = normalizePaymentType(option.value);
            if (!normalizedValue) {
                return acc;
            }

            if (acc.find(item => item.value === normalizedValue)) {
                return acc;
            }

            const label = option.label || (normalizedValue === 'full' ? 'Full Payment' : 'Deposit');
            acc.push({ label, value: normalizedValue });
            return acc;
        }, []);
    }, [paymentTypeOptions]);

    const paymentOptions = useMemo(() => {
        const optionsToUse = normalizedPaymentOptions;

        if (!optionsToUse.length) {
            return [];
        }

        if (initialPaymentType === 'full') {
            return optionsToUse.filter(option => option.value === 'full');
        }

        if (initialPaymentType === 'deposit') {
            return optionsToUse;
        }

        return optionsToUse;
    }, [initialPaymentType, normalizedPaymentOptions]);

    const handlePaymentTypeChange = (event) => {
        if (!paymentOptions.length) {
            return;
        }

        const nextValue = event.target.value;
        const availableValues = paymentOptions.map(option => option.value);
        const appliedValue = availableValues.includes(nextValue)
            ? nextValue
            : availableValues[0];

        setSelectedPaymentType(appliedValue);

        if (typeof onPaymentTypeChange === 'function') {
            onPaymentTypeChange(appliedValue);
        }
    };

    const formatDate = (value) => {
        if (!value) {
            return '-';
        }

        const parsed = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return '-';
        }

        const day = String(parsed.getDate()).padStart(2, '0');
        const month = String(parsed.getMonth() + 1).padStart(2, '0');
        const year = parsed.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const preOrderNotes = preOrderNote || null;
    const preOrderAvailableDate = releaseDate || null;
    const preOrderClosingDate = preOrderDate || null;

    const normalizeDeposit = (value) => {
        if (!value && value !== 0) {
            return '-';
        }

        const numeric = typeof value === 'number'
            ? value
            : Number.parseFloat(value.toString().replace(/[^0-9.-]/g, ''));

        if (Number.isNaN(numeric)) {
            return value;
        }

        // Tampilkan sebagai persentase tanpa 0 di belakang koma dan tambahkan '%'
        // Contoh: 10.00 -> '10%'; 12.5 -> '12.5%'; 12.50 -> '12.5%'
        let str = numeric.toString();
        if (str.includes('.')) {
            // hapus trailing zeros di desimal
            str = str.replace(/\.0+$/,'');
            str = str.replace(/\.(\d*[1-9])0+$/,'.$1');
        }
        return `${str}%`;
    };

    const depositValue = normalizeDeposit(preOrderDeposite);
    const showDepositRow = selectedPaymentType === 'deposit';

    const isPreOrderClosed = (() => {
        if (!preOrderClosingDate) return false;

        const parsed = preOrderClosingDate instanceof Date
            ? preOrderClosingDate
            : new Date(preOrderClosingDate);

        if (Number.isNaN(parsed.getTime())) return false;

        parsed.setHours(23, 59, 59, 999);
        return new Date().getTime() > parsed.getTime();
    })();

    return isPreOrder ? (
        <>
            <div
                className={cn(
                    'flex flex-col border border-gray-100 rounded-lg p-5 m-4 gap-4 bg-white',
                    className
                )}
            >
                <div className='text-[16px] font-semibold text-colorDefault'>
                    Pre Order Details
                </div>
                <div className='flex flex-col gap-3'>
                    {showDepositRow && (
                        <>
                            <div className='flex justify-between text-[13px] text-gray-600'>
                                <span className='font-medium text-gray-500'>Deposit:</span>
                                <span className='font-medium text-colorDefault'>{depositValue}</span>
                            </div>
                            <Divider className='h-px w-full bg-gray-100' />
                        </>
                    )}
                    <div className='flex justify-between items-center text-[13px] text-gray-600 gap-4'>
                        <span className='font-medium text-gray-500'>Payment Type:</span>
                        <Select
                            wrapperClassname='justify-end w-full max-w-[180px]'
                            className='w-full text-[13px]'
                            options={paymentOptions}
                            value={selectedPaymentType}
                            onChange={handlePaymentTypeChange}
                            showPlaceholder={false}
                        />
                    </div>
                    <Divider className='h-px w-full bg-gray-100' />
                    <div className='flex justify-between text-[13px] text-gray-600'>
                        <span className='font-medium text-gray-500'>Pre Order Closing Date:</span>
                        <span className='font-medium text-colorDefault'>{formatDate(preOrderClosingDate)}</span>
                    </div>
                    <Divider className='h-px w-full bg-gray-100' />
                    <div className='flex justify-between text-[13px] text-gray-600'>
                        <span className='font-medium text-gray-500'>Release Date:</span>
                        <span className='font-medium text-colorDefault'>{formatDate(preOrderAvailableDate)}</span>
                    </div>
                    <Divider className='h-px w-full bg-gray-100' />
                    <div className='flex justify-between text-[13px] text-gray-600'>
                        <span className='font-medium text-gray-500'>Note:</span>
                        <span className='font-medium text-colorDefault text-right'>
                            {preOrderNotes || '-'}
                        </span>
                    </div>
                    {isPreOrderClosed && (
                        <div className='mt-1 text-[12px] text-red-500 font-medium'>
                            Pre order is closed. You can no longer place a pre-order for this product.
                        </div>
                    )}
                </div>
            </div>
        </>
    ) : ''
}

export default preOrderInfo