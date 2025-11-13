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
import { Verify, Shop } from 'iconsax-react';
import PlaceholderImage from '@magento/venia-ui/lib/components/Image/placeholderImage';
import { Link, useHistory } from 'react-router-dom';

const OrderRow = props => {
    const { order } = props;
    const { formatMessage } = useIntl();
    const history = useHistory();
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

    // Determine seller/store name from first item if available
    const sellerName = items && items.length > 0 && items[0] && items[0].seller_name
        ? items[0].seller_name
        : '-';

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
        return 'text-blue-700 text-[14px] font-medium py-[5px] border-none';
    }

    const thumbnailProps = {
        alt: items[0].product_name,
        classes: { root: classes.thumbnail },
        width: 50
    };


    // Helper to resolve a product image by SKU with graceful fallback, now prefers product_image_url from order.items
    const getThumbnailForSku = (sku, fallbackLabel, idx) => {
        let url = null;
        let label = fallbackLabel;
        // Prefer product_image_url from order.items if present and is a non-empty string
        if (items && items[idx] && typeof items[idx].product_image_url === 'string' && items[idx].product_image_url.trim() !== '') {
            url = items[idx].product_image_url;
        } else if (imagesData && typeof imagesData === 'object') {
            const byKey = sku && imagesData[sku];
            const byValue = !byKey && sku
                ? Object.values(imagesData).find(entry => entry?.sku === sku)
                : null;
            const chosen = byKey || byValue;
            if (chosen?.thumbnail?.url && typeof chosen.thumbnail.url === 'string' && chosen.thumbnail.url.trim() !== '') {
                url = chosen.thumbnail.url;
                label = chosen.thumbnail.label || label;
            }
        }
        // If url is not a non-empty string, fallback to null (will trigger placeholder)
        if (typeof url !== 'string' || url.trim() === '') {
            url = null;
        }
        return { url, label };
    };

    const showNewReturnButton = status === 'Complete' || derivedStatus === formatMessage({ id: 'orderRow.deliveredText', defaultMessage: 'Delivered' });

    const handleNewReturn = () => {
        // Inject product_image per item with safe fallbacks (prefer product_image_url from query)
        let orderWithImages = { ...order };
        if (orderWithImages.items && Array.isArray(orderWithImages.items)) {
            orderWithImages = {
                ...orderWithImages,
                items: orderWithImages.items.map(it => {
                    // Start with empty string to avoid undefined passed to Image component downstream
                    let product_image = '';
                    // 1) Prefer product_image_url from order items (added by query)
                    if (typeof it.product_image_url === 'string' && it.product_image_url.trim() !== '') {
                        product_image = it.product_image_url;
                    }
                    // 2) Fallback to imagesData thumbnail url (if available)
                    else if (
                        imagesData &&
                        it.product_sku &&
                        imagesData[it.product_sku]?.thumbnail?.url &&
                        typeof imagesData[it.product_sku].thumbnail.url === 'string' &&
                        imagesData[it.product_sku].thumbnail.url.trim() !== ''
                    ) {
                        product_image = imagesData[it.product_sku].thumbnail.url;
                    }

                    return {
                        ...it,
                        // Keep product_image_url as-is, add product_image for RMACreate consumers
                        product_image
                    };
                })
            };
        }
        try {
            localStorage.setItem('rma_order', JSON.stringify(orderWithImages));
        } catch (e) {}
        history.push({
            pathname: `/return/create/${orderNumber}`,
            state: { order: orderWithImages }
        });
    };

    return (
        <li className={classes.root}>
            <div className='flex flex-col md_flex-row md_items-start justify-between mb-2.5'>
                <div className='flex flex-col ml-[14px] mt-[5px]'>
                    <div className="flex gap-x-[15px] flex-col">
                        <div className='flex gap-x-[5px] items-center'>
                            <Shop size={17} className='text-blue-700' variant="Bold" />
                            <span className='text-[14px] font-medium text-blue-700'>
                                {sellerName}
                            </span>
                            <span>|</span>
                            <span className="text-blue-700 text-[14px]">#{orderNumber}</span>
                        </div>
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
                <div className='flex flex-col ml-[5px]'>
                    <div className='flex flex-row'>
                        <div className={cn('flex flex-col gap-2')}>
                            {items && items.length > 0 && items.map((it, idx) => {
                                const { url, label } = getThumbnailForSku(it.product_sku, it.product_name, idx);
                                return (
                                    <div key={it.id || idx} className={classes.productImage}>
                                        {url ? (
                                            <img
                                                src={url}
                                                alt={label}
                                                width={80}
                                                className={classes.thumbnail}
                                            />
                                        ) : (
                                            <PlaceholderImage alt={it.product_name} classes={{ root: classes.thumbnail }} width={60} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className='flex flex-col max-w-[375px] gap-8'>
                            {items && items.length > 0 && items.map((it, idx) => (
                                <div key={it.id || idx} className='flex flex-col gap-1 pb-2 last_pb-0'>
                                    <div className={cn(classes.productName, 'text-[14] font-medium')}>
                                        <span>{it.product_name}</span>
                                    </div>
                                    <div className="text-[14] text-gray-300">
                                        <span>Qty : {`${it.quantity_ordered}`}</span>
                                        <br />
                                        <span>
                                            Price : <Price currencyCode={it?.product_sale_price?.currency} value={it?.product_sale_price?.value} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right column: bottom-aligned Order Total + CTA */}
                <div className='flex flex-col items-end gap-2 md_pl-10 md_self-end mr-4 mb-1'>
                    <div className="md_text-right">
                        <span className="text-[14] text-gray-200 block mb-1">
                            <FormattedMessage
                                id={'orderRow.orderTotalText'}
                                defaultMessage={'Order Total'}
                            />
                        </span>
                        <div className="text-lg font-medium">{orderTotalPrice}</div>
                    </div>
                    <div className="flex flex-row gap-2 w-full justify-end items-center">
                        {showNewReturnButton && (
                            <button
                                type="button"
                                className="bg-blue-700 hover:bg-white hover:text-blue-700 hover:border hover:border-blue-700 rounded-full px-[30px] py-[5px] text-[13px] font-medium text-white transition-all duration-300 ease-in-out"
                                onClick={handleNewReturn}
                            >
                                <FormattedMessage
                                    id={'orderRow.newReturn'}
                                    defaultMessage={'New Return'}
                                />
                            </button>
                        )}
                        <Link 
                            to={{
                                pathname: `/order-history/view/${orderNumber}`,
                                state: { order }
                            }}
                        >
                            <span className="bg-blue-700 hover:bg-white hover:text-blue-700 hover:border hover:border-blue-700 rounded-full px-[30px] py-[5px] text-[13px] font-medium text-white transition-all duration-300 ease-in-out">
                                <FormattedMessage
                                    id={'orderRow.ViewTransactionDetail'}
                                    defaultMessage={'View Order Detail'}
                                />
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
                seller_name: string,
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
