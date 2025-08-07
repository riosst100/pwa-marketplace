import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';
import { func } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import GiftOptionsSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftOptionsSection';

import defaultClasses from './priceAdjustments.module.css';
import cn from 'classnames';

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { setPageIsUpdating } = props;
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <Accordion
                canOpenMultiple={true}
                classes={{
                    root: 'w-full'
                }}
            >
                <Section
                    data-cy="PriceAdjustments-couponCodeSection"
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'checkoutPage.couponCode',
                        defaultMessage: 'Enter Coupon Code'
                    })}
                    classes={{
                        root: cn('border border-gray-100 rounded-md max-w-[400px] p-2.5'),
                        title: 'text-[16px] font-medium',
                        title_wrapper: 'gap-sm grid grid-cols-1 grid-flow-col h-[38px] items-center justify-items-start',
                        contents_container: 'p-0'
                    }}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <CouponCode setIsCartUpdating={setPageIsUpdating} />
                    </Suspense>
                </Section>
                <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
                <GiftOptionsSection />
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};
