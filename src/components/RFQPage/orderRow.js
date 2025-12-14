import React from 'react';
import { number, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './orderRow.module.css';
import { Link } from 'react-router-dom';
import cn from 'classnames';

const OrderRow = props => {
    const { rfq } = props;
    const { formatMessage } = useIntl();
    const {
        quickrfq_id,
        status,
        product_name,
        quantity,
        price_per_product,
        store_currency_code
    } = rfq;

    const classes = useStyle(defaultClasses, props.classes);

    const unitPrice =
        price_per_product && typeof price_per_product.value === 'number'
            ? price_per_product.value
            : null;
    const unitCurrency =
        price_per_product && price_per_product.currency
            ? price_per_product.currency
            : store_currency_code;

    const qtyNumber = typeof quantity === 'number'
        ? quantity
        : (typeof quantity === 'string' ? parseFloat(quantity) : 0);
    const totalPrice =
        unitPrice !== null && !isNaN(qtyNumber)
            ? unitPrice * qtyNumber
            : null;

    const badgeStatusStyle = () => {
        return 'text-blue-700 text-[14px] font-medium py-[5px] border-none';
    };

    return (
        <li className={classes.root}>
            <div
                className='flex flex-col md_flex-row md_items-start justify-between mb-2.5'
                style={{ borderBottom: '1px solid #e6e9ea', paddingBottom: '10px' }}
            >
                <div className='flex flex-col ml-[14px] mt-[5px]'>
                    <div className='flex gap-x-[15px] flex-col'>
                        <div className='flex gap-x-[5px] items-center'>
                            <span className='text-blue-700 text-[14px]'>#{quickrfq_id}</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='flex w-full justify-start mt-2.5 md_mt-0 md_justify-end'>
                        <span className={cn(classes.orderStatusBadge, badgeStatusStyle())}>{status}</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col md_flex-column justify-between mb-0'>
                <div className='flex flex-col ml-[5px] gap-y-[10px]'>
                    <div
                        className='flex flex-row gap-4 mb-1 justify-between'
                        style={{ borderBottom: '1px solid #e6e9ea', paddingBottom: '10px' }}
                    >
                        <div className='flex flex-col gap-1 pb-2 last_pb-0 max-w-[375px]'>
                            <div className={cn(classes.productName, 'text-[14px] font-medium')}>
                                <span>{product_name}</span>
                            </div>
                            <div className='text-[12px]'>
                                <span>x{`${quantity}`}</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1 pb-2 last_pb-0 justify-center">
                            <div class="text-[14px] text-blue-700 mr-4">
                                <span>
                                    {unitPrice !== null ? (
                                        <Price currencyCode={unitCurrency} value={unitPrice} />
                                    ) : (
                                        '-'
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-end gap-4 md_pl-10 md_self-end mr-4 mb-1 pt-2'>
                    <div className='md_text-right flex flex-row gap-5 items-center'>
                        <span className='text-[14px] text-gray-200 block mb-1'>
                            <FormattedMessage id={'orderRow.orderTotalText'} defaultMessage={'Order Total'} />
                        </span>
                        <div className='text-lg font-medium text-blue-700'>
                            {totalPrice !== null ? (
                                <Price currencyCode={unitCurrency} value={totalPrice} />
                            ) : (
                                '-'
                            )}
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 w-full justify-end items-center'>
                        <Link to={`/quotes/${quickrfq_id}`}>
                            <span className='bg-blue-700 hover:bg-white hover:text-blue-700 hover:border hover:border-blue-700 rounded-full px-[30px] py-[8px] text-[13px] font-medium text-white transition-all duration-300 ease-in-out'>
                                <FormattedMessage id={'orderRow.ViewTransactionDetail'} defaultMessage={'View Offer'} />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default OrderRow;

OrderRow.propTypes = {
    classes: shape({
        root: string,
        cell: string,
        stackedCell: string,
        label: string,
        value: string,
        orderNumberContainer: string,
        orderDateContainer: string,
        orderTotalContainer: string,
        orderStatusContainer: string,
        orderItemsContainer: string,
        contentToggleContainer: string,
        orderNumberLabel: string,
        orderDateLabel: string,
        orderTotalLabel: string,
        orderNumber: string,
        orderDate: string,
        orderTotal: string,
        orderStatusBadge: string,
        content: string,
        content_collapsed: string
    }),
    rfq: shape({
        quickrfq_id: string,
        status: string,
        product_name: string,
        quantity: string,
        price_per_product: shape({
            currency: string,
            value: number
        }),
        store_currency_code: string
    })
};
