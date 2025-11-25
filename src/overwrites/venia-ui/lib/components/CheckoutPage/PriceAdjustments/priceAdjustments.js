import React, { Suspense, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { func } from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import SellerCouponCheckout from '@riosst100/pwa-marketplace/src/components/SellerCoupon/sellerCouponCheckout';
import couponCodeOperations from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/couponCode.gql';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import GiftOptionsSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftOptionsSection';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import defaultClasses from './priceAdjustments.module.css';
import cn from 'classnames';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { FormattedMessage } from 'react-intl';

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
    const [sectionOpen, setSectionOpen] = useState(true);
    const [couponModalOpen, setCouponModalOpen] = useState(false);

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

    const handleViewCoupons = useCallback(() => {
        setCouponModalOpen(true);
    }, [setCouponModalOpen]);

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
            <div className={classes.coupon_container}>
                <h5 className={classes.cardTitle}>
                    {formatMessage({
                        id: 'checkoutPage.couponCode',
                        defaultMessage: 'Apply Coupon'
                    })}
                </h5>
                {applyingCoupon || appliedLoading ? <LoadingIndicator classes={{ root: classes.loading }}>
                    <FormattedMessage
                        id={'checkoutPage.loadingApplyingCoupon'}
                        defaultMessage={'Applying Coupon'}
                    />
                </LoadingIndicator> : removingCoupon ? <LoadingIndicator classes={{ root: classes.loading }}>
                    <FormattedMessage
                        id={'checkoutPage.loadingRemovingCoupon'}
                        defaultMessage={'Removing Coupon'}
                    />
                </LoadingIndicator> :
                <Suspense fallback={<LoadingIndicator />}>
                    <CouponCode setIsCartUpdating={setPageIsUpdating} />
                    {appliedCoupons.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                            {appliedCoupons.map(c => {
                                const coupon = couponData.sellerCoupons.items.find(item => item.code === c.code);
                                return <div key={c.code} className="flex items-center gap-2 bg-[#fff8f1] border border-[#ffb891] rounded px-2 py-1 text-sm font-medium text-[#f76b1c]">
                                    <span>{coupon.name} ({coupon.code})</span>
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
                            })}
                        </div>
                    )}
                    {!appliedCoupons.length && couponData?.sellerCoupons?.items.length ? <button class="p-2 text-[13px] text-blue-700 border border-solid cursor-pointer rounded-full w-full mt-4" onClick={handleViewCoupons}>Select coupon to apply</button> : ''}
                    {couponModalOpen && (
                        <SellerCouponCheckout
                            couponData={couponData}
                            couponLoading={couponLoading || applyingCoupon || appliedLoading || removingCoupon}
                            couponError={couponError}
                            autoOpen={true}
                            closeOnClaim={true}
                            couponModalOpen={couponModalOpen}
                            setCouponModalOpen={setCouponModalOpen}
                            onSelectCoupon={handleApplyFromClaim}
                            onTriggerRender={() => null}
                        />
                    )}
                </Suspense>}
            </div>
            <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
            <GiftOptionsSection />
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};
