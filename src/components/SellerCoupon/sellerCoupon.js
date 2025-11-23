import React, { useMemo, useState } from 'react';
import classes from './sellerCoupon.module.css';

const dayDiff = (toDate) => {
    if (!toDate) return null;
    const end = new Date(toDate);
    if (Number.isNaN(end.getTime())) return null;
    const now = new Date();
    const diffMs = end.setHours(23, 59, 59, 999) - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
};

const SellerCoupon = ({ couponData, couponError, couponLoading }) => {
    if (couponLoading) {
        return <div className={classes.container}><p className={classes.metaText}>Loading coupons...</p></div>;
    }

    if (couponError) {
        return <div className={classes.container}><p className={classes.metaText}>Failed to load coupons.</p></div>;
    }

    const items = couponData?.sellerCoupons?.items || [];

    if (!items.length) {
        return <div className={classes.container}><p className={classes.metaText}>No coupons available.</p></div>;
    }

    const [copied, setCopied] = useState(null);

    const handleClaim = async (code) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(code);
            }
        } catch (_) {
            // ignore clipboard issues
        }
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <section className={classes.container} aria-label="Seller coupons">
            <div className={classes.scroller}>
                {items.map(item => {
                    const key = item.couponcode_id || item.coupon_id || item.code;
                    const daysLeft = dayDiff(item.to_date);
                    const expiryLabel = daysLeft === null
                        ? 'No expiry'
                        : daysLeft <= 0
                            ? 'Ends today'
                            : `Ends in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;

                    const title = item.description || item.name || `Discount ${item.discount_amount || ''}`;

                    return (
                        <div className={classes.card} key={key} role="group" aria-label={`Coupon ${item.code}`}>
                            <div className={classes.perf} aria-hidden="true" />
                            <div className={classes.content}>
                                <div className={classes.title}>{title}</div>
                                <div className={classes.subtext}>Code: <span className={classes.code}>{item.code}</span></div>
                                <div className={classes.expiry}>{expiryLabel}</div>
                            </div>
                            <div className={classes.divider} aria-hidden="true" />
                            <div className={classes.actions}>
                                <button
                                    type="button"
                                    className={classes.claimBtn}
                                    onClick={() => handleClaim(item.code)}
                                    aria-label={`Claim coupon ${item.code}`}
                                >
                                    {copied === item.code ? 'Copied' : 'Claim'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default SellerCoupon;