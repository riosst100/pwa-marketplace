
import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import { Shop } from 'iconsax-react';
import PlaceholderImage from '@magento/venia-ui/lib/components/Image/placeholderImage';
import { Link } from 'react-router-dom';
import defaultClasses from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/OrderHistoryPage/orderRow.module.css';

const RmaRow = props => {
    const { rma } = props;
    const { formatMessage } = useIntl();
    const {
        created_at,
        increment_id,
        order_increment_id,
        items,
        order,
        rma_date,
        rma_id,
        seller,
        status,
        status_label,
        rmaDetailLoading,
        rmaDetailError,
        rmaDetailData
    } = rma;

    const classes = useStyle(defaultClasses, props.classes);
    // Format date
    const isoFormattedDate = created_at ? created_at.replace(' ', 'T') : '';
    const formattedDate = isoFormattedDate ? new Date(isoFormattedDate).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    ) : '';

    // Seller name: prefer from first item's seller_name, fallback to seller?.name
    let sellerName = '-';
    if (items && items.length > 0 && items[0].seller_name) {
        sellerName = items[0].seller_name;
    } else if (seller?.name) {
        sellerName = seller.name;
    }


    const badgeStatusStyle = () => {
        return 'text-blue-700 text-[14px] font-medium py-[5px] border-none';
    }

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
                            <span className="text-blue-700 text-[14px]">#{order_increment_id}</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='flex w-full justify-start mt-2.5 md_mt-0 md_justify-end'>
                        <span className={cn(classes.orderStatusBadge, badgeStatusStyle())}>
                            {status_label || status}
                        </span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col md_flex-row justify-between mb-2.5'>
                <div className='flex flex-col ml-[14px]'>
                    <div className='flex flex-row'>
                        <div className={cn('mr-4 flex flex-col gap-8')}>
                            {items && items.length > 0 && items.map((it, idx) => {
                                const thumbnailProps = {
                                    alt: it.name,
                                    classes: { root: classes.thumbnail },
                                    width: 50
                                };
                                return (
                                    <div key={it.id || idx} className={classes.productImage}>
                                        {it.image_url ? (
                                            <img src={it.image_url} alt={it.name} width={70} className={classes.thumbnail} />
                                        ) : (
                                            <PlaceholderImage {...thumbnailProps} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className='flex flex-col max-w-[375px] gap-8'>
                            {items && items.length > 0 && items.map((it, idx) => (
                                <div key={it.id || idx} className='flex flex-col gap-1 pb-2 last_pb-0'>
                                    <div className={cn(classes.productName, 'text-[14] font-medium')}>
                                        <span>{it.name}</span>
                                    </div>
                                    <div className="text-[14] text-gray-300">
                                        <span>Qty : {`${it.qty_requested || 0}`}</span>
                                        <br />
                                        <span>
                                            Price : {it.price ? <Price currencyCode={it.price.currency} value={it.price.value} /> : '-'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right column: bottom-aligned RMA Date + CTA */}
                <div className='flex flex-col items-end gap-2 md_pl-10 md_self-end mr-4 mb-1'>
                    <Link 
                            to={{
                                pathname: `/return/view/${rma_id}`,
                                state: { rma }
                            }}
                        >
                        <span className="bg-blue-700 hover:bg-white hover:text-blue-700 hover:border hover:border-blue-700 rounded-full px-[30px] py-[5px] text-[13px] font-medium text-white transition-all duration-300 ease-in-out">
                            <FormattedMessage
                                id={'rmaRow.ViewTransactionDetail'}
                                defaultMessage={'View RMA Detail'}
                            />
                        </span>
                    </Link>
                </div>
            </div>
        </li>
    );
};

RmaRow.propTypes = {
    rma: shape({
        created_at: string,
        increment_id: string,
        items: arrayOf(
            shape({
                id: string,
                name: string,
                price: shape({
                    currency: string,
                    value: number
                }),
                qty_requested: number
            })
        ),
        order: shape({
            id: string,
            increment_id: string,
            status: string,
            status_label: string
        }),
        rma_date: string,
        rma_id: string,
        seller: shape({
            id: string,
            name: string,
            url: string
        }),
        status: string,
        status_label: string
    })
};

export default RmaRow;
