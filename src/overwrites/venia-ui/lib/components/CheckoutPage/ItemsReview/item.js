import React from 'react';
import { FormattedMessage } from 'react-intl';

import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Image from '@magento/venia-ui/lib/components/Image';
import { useStyle } from '@magento/venia-ui/lib/classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import defaultClasses from './item.module.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden,
        configurableThumbnailSource,
        // Preorder-related fields passed via {...item}
        is_preorder,
        pre_order_payment_type,
        pre_order_deposit,
        release_date
    } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root_visible;
    const configured_variant = configuredVariant(configurable_options, product);
    const formatDate = value => {
        if (!value) return '-';
        const d = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(d.getTime())) return '-';
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };
    const formatDepositPercent = raw => {
        const n = typeof raw === 'number' ? raw : Number.parseFloat(String(raw).replace(/[^0-9.-]/g,''));
        if (!Number.isFinite(n)) return raw;
        let str = n.toString();
        if (str.includes('.')) {
            str = str.replace(/\.0+$/,'');
            str = str.replace(/\.(\d*[1-9])0+$/,'.$1');
        }
        return `${str}%`;
    };
    return (
        <div className={className}>
            <Image
                alt={product.name}
                classes={{ root: classes.thumbnail }}
                width={50}
                resource={
                    configurableThumbnailSource === 'itself' &&
                        configured_variant
                        ? configured_variant.thumbnail.url
                        : product.thumbnail.url
                }
            />
            <div className={classes.headerRow}>
                {is_preorder && (
                    <span className={classes.preorderBadge}>Preorder</span>
                )}
                <span className={classes.name}>{product.name}</span>
            </div>
            {is_preorder && (
                <div className={classes.preorderMeta} aria-label="Preorder information">
                    <span className={classes.metaItem}>
                        Release: {formatDate(typeof release_date !== 'undefined' ? release_date : product?.release_date)}
                    </span>
                    {pre_order_payment_type === 'deposit' && pre_order_deposit != null && (
                        <span className={classes.metaItem}>
                            Deposit: {formatDepositPercent(pre_order_deposit)}
                        </span>
                    )}
                </div>
            )}
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>
                <FormattedMessage
                    id={'checkoutPage.quantity'}
                    defaultMessage={'Qty : {quantity}'}
                    values={{ quantity }}
                />
            </span>
        </div>
    );
};

export default Item;
