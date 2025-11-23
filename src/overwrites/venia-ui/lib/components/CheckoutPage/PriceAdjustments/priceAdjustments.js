import React, { Suspense, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { func } from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import SellerCouponCheckout from '@riosst100/pwa-marketplace/src/components/SellerCoupon/sellerCouponCheckout';
import couponCodeOperations from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/couponCode.gql';
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

    const { setPageIsUpdating, couponData, couponLoading, couponError } = props;
    const { formatMessage } = useIntl();
    const [{ cartId }] = useCartContext();
    const [applyCoupon, { loading: applyingCoupon }] = useMutation(couponCodeOperations.applyCouponMutation);
    const [removeCoupon, { loading: removingCoupon }] = useMutation(couponCodeOperations.removeCouponMutation);
    const { data: appliedData, loading: appliedLoading } = useQuery(
        couponCodeOperations.getAppliedCouponsQuery,
        { variables: { cartId }, skip: !cartId }
    );
    const [sectionOpen, setSectionOpen] = useState(false);

    const handleApplyFromClaim = useCallback(async (item) => {
        if (!item?.code || !cartId) return;
        try {
            setPageIsUpdating(true);
            await applyCoupon({
                variables: { cartId, couponCode: item.code }
            });
        } catch (e) {
            // silent; error surfaced by apollo links/toasts if configured
        } finally {
            setPageIsUpdating(false);
        }
    }, [applyCoupon, cartId, setPageIsUpdating]);

    const handleRemoveCoupon = useCallback(async () => {
        if (!cartId) return;
        try {
            setPageIsUpdating(true);
            await removeCoupon({ variables: { cartId } });
        } catch (e) {
            // silent
        } finally {
            setPageIsUpdating(false);
        }
    }, [removeCoupon, cartId, setPageIsUpdating]);

    const appliedCoupons = appliedData?.cart?.applied_coupons || [];

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
                        defaultMessage: 'Apply Coupon Code'
                    })}
                    classes={{
                        root: cn('border border-gray-100 rounded-md max-w-[400px] p-2.5'),
                        title: 'text-[16px] font-medium cursor-pointer',
                        title_wrapper: 'gap-sm grid grid-cols-1 grid-flow-col h-[38px] items-center justify-items-start',
                        contents_container: 'p-0'
                    }}
                    onClick={() => setSectionOpen(prev => !prev)}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        {sectionOpen && (
                            <SellerCouponCheckout
                                couponData={couponData}
                                couponLoading={couponLoading || applyingCoupon || appliedLoading || removingCoupon}
                                couponError={couponError}
                                autoOpen={true}
                                closeOnClaim={true}
                                onSelectCoupon={handleApplyFromClaim}
                                onTriggerRender={() => null}
                            />
                        )}
                        {appliedCoupons.length > 0 && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                                {appliedCoupons.map(c => (
                                    <div key={c.code} className="flex items-center gap-2 bg-[#fff8f1] border border-[#ffb891] rounded px-2 py-1 text-sm font-medium text-[#f76b1c]">
                                        <span>{c.code}</span>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            disabled={removingCoupon}
                                            className="text-[#a94442] hover:text-[#f26313] disabled:opacity-50"
                                            aria-label={formatMessage({ id: 'checkoutPage.removeCoupon', defaultMessage: 'Remove coupon' })}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
