import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import CollapsedImageGallery from './collapsedImageGallery';
import OrderProgressBar from './orderProgressBar';
import OrderDetails from './OrderDetails';
import defaultClasses from './orderRow.module.css';
import cn from 'classnames';
import { Verify } from 'iconsax-react';
import PlaceholderImage from '@magento/venia-ui/lib/components/Image/placeholderImage';
import { Link } from 'react-router-dom';

const OrderRow = props => {
    const { order } = props;
    const { formatMessage } = useIntl();
    const {
        invoices,
        items,
        number: orderNumber,
        order_date: orderDate,
        shipments,
        status,
        total
    } = order;
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;

    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = orderDate.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    );

    const hasInvoice = !!invoices.length;
    const hasShipment = !!shipments.length;
    let derivedStatus;
    if (status === 'Complete') {
        derivedStatus = formatMessage({
            id: 'orderRow.deliveredText',
            defaultMessage: 'Delivered'
        });
    } else if (hasShipment) {
        derivedStatus = formatMessage({
            id: 'orderRow.shippedText',
            defaultMessage: 'Shipped'
        });
    } else if (hasInvoice) {
        derivedStatus = formatMessage({
            id: 'orderRow.readyToShipText',
            defaultMessage: 'Ready to ship'
        });
    } else {
        derivedStatus = formatMessage({
            id: 'orderRow.processingText',
            defaultMessage: 'Processing'
        });
    }

    const talonProps = useOrderRow({ items });
    const { loading, isOpen, handleContentToggle, imagesData } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const contentClass = isOpen ? classes.content : classes.content_collapsed;

    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;

    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;

    const collapsedImageGalleryElement = isOpen ? null : (
        <CollapsedImageGallery items={imagesData} />
    );

    const orderDetails = loading ? null : (
        <OrderDetails orderData={order} imagesData={imagesData} />
    );

    const orderTotalPrice =
        currency && orderTotal !== null ? (
            <Price currencyCode={currency} value={orderTotal} />
        ) : (
            '-'
        );

    const badgeStatusStyle = () => {
        return 'bg-[#F1EFF6] text-blue-700 text-[14px] font-semibold rounded-full px-[30px] py-[5px] border-none';
    }

    const thumbnailProps = {
        alt: items[0].product_name,
        classes: { root: classes.thumbnail },
        width: 50
    };

    return (
        <li className={classes.root}>
            <div className='flex flex-col md_flex-row justify-between mb-2.5'>
                <div className='flex flex-col'>
                    <div className="flex gap-x-[15px] flex-row">
                        <span className="text-[14px] text-colorDefault">{formattedDate}</span>
                        <span className="text-gray-200 text-[14px]">{orderNumber}</span>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='flex w-full justify-start mt-2.5 md_mt-0 md_justify-end'>
                        <span className={cn(classes.orderStatusBadge, badgeStatusStyle())}>
                            {derivedStatus}
                        </span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col md_flex-row justify-between mb-2.5'>
                <div className='flex flex-col'>
                    <div className='flex gap-x-[5px] mb-2.5'>
                        <Verify size={17} className='text-blue-700' variant="Bold" />
                        <span className='text-xs font-medium text-[rgba(25, 34, 42, 0.7)]'>
                            Gundam Info
                        </span>
                    </div>
                    <div className='flex flex-row'>
                        <div>
                            <PlaceholderImage {...thumbnailProps} />
                        </div>
                        <div className='flex flex-col max-w-[260px] gap-2.5'>
                            <div className={cn(classes.productName, 'text-[14] font-medium')}>
                                <span>
                                    {items[0]?.product_name}
                                </span>
                            </div>
                            <div className="text-[14] text-gray-200">
                                <span>
                                    {`${items[0]?.quantity_ordered}X`}
                                </span>
                                {' '}
                                <span>
                                    <Price currencyCode={items[0]?.product_sale_price?.currency} value={items[0]?.product_sale_price?.value} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className="md_px-10 py-3 md_border-l border-gray-100">
                        <span className="text-[14] text-gray-200 text-left md_text-center block mb-2">
                            <FormattedMessage
                                id={'orderRow.orderTotalText'}
                                defaultMessage={'Order Total'}
                            />
                        </span>
                        <div className="text-lg font-semibold text-left md_text-center block">{orderTotalPrice}</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-row justify-end py-[5px]'>
                {/* <button
                    className={cn(classes.contentToggleContainer, '!p-0 !border-0')}
                    onClick={handleContentToggle}
                    type="button"
                    aria-expanded={isOpen}
                >
                    <span className="text-[13px] font-medium text-blue-700 underline">
                        <FormattedMessage
                            id={'orderRow.ViewTransactionDetail'}
                            defaultMessage={'View Transaction Detail'}
                        />
                    </span>
                </button> */}
                <Link to="/order-history/view/123213">
                    <span className="text-[13px] font-medium text-blue-700 underline">
                        <FormattedMessage
                            id={'orderRow.ViewTransactionDetail'}
                            defaultMessage={'View Transaction Detail'}
                        />
                    </span>
                </Link>
            </div>

            {/* <div className={classes.orderDateContainer}>
                <span className={classes.orderDateLabel}>
                    <FormattedMessage
                        id={'orderRow.orderDateText'}
                        defaultMessage={'Order Date'}
                    />
                </span>
                <span className={classes.orderDate}>{formattedDate}</span>
            </div> */}
            {/* <div className={classes.orderItemsContainer}>
                {collapsedImageGalleryElement}
            </div> */}
            {/* <div className={classes.orderStatusContainer}>
                <span className={classes.orderStatusBadge}>
                    {derivedStatus}
                </span>
                <OrderProgressBar status={derivedStatus} />
            </div> */}
            <div className={cn(contentClass, '!py-4 mt-4')}>{orderDetails}</div>
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
    order: shape({
        billing_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string)
        }),
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        invoices: arrayOf(
            shape({
                id: string
            })
        ),
        number: string,
        order_date: string,
        payment_methods: arrayOf(
            shape({
                type: string,
                additional_data: arrayOf(
                    shape({
                        name: string,
                        value: string
                    })
                )
            })
        ),
        shipping_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string),
            telephone: string
        }),
        shipping_method: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        ),
        status: string,
        total: shape({
            discounts: arrayOf(
                shape({
                    amount: shape({
                        currency: string,
                        value: number
                    })
                })
            ),
            grand_total: shape({
                currency: string,
                value: number
            }),
            subtotal: shape({
                currency: string,
                value: number
            }),
            total_tax: shape({
                currency: string,
                value: number
            }),
            total_shipping: shape({
                currency: string,
                value: number
            })
        })
    })
};
