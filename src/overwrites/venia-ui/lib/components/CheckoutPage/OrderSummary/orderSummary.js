import React from 'react';
import { FormattedMessage } from 'react-intl';
import PriceSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './orderSummary.module.css';

const OrderSummary = props => {
    const classes = useStyle(defaultClasses, props.classes);
    console.log("🚀 ~ OrderSummary ~ props:", props)
    return (
        <div data-cy="OrderSummary-root" className={classes.root}>
            <h2 aria-live="polite" className="text-[16px] font-medium mb-4">
                <FormattedMessage
                    id={'checkoutPage.orderSummary'}
                    defaultMessage={'Summary'}
                />
            </h2>
            <PriceSummary isUpdating={props.isUpdating} />
            <style jsx>
                {`
                    li[class*="priceSummary-lineItems"] span:first-child {
                        margin-top: 0;
                        margin-bottom: 12px;
                        font-weight: 500;
                        font-size: 14px;
                    }
                `}
            </style>
        </div>
    );
};

export default OrderSummary;
