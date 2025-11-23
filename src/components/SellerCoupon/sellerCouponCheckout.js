import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import listClasses from './sellerCoupon.module.css';
import modalClasses from './sellerCouponCheckout.module.css';

// Reuse day diff logic
const dayDiff = (toDate) => {
    if (!toDate) return null;
    const end = new Date(toDate);
    if (Number.isNaN(end.getTime())) return null;
    const now = new Date();
    const diffMs = end.setHours(23, 59, 59, 999) - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Simple portal root fallback
const getPortalRoot = () => {
    let root = document.getElementById('seller-coupon-portal');
    if (!root) {
        root = document.createElement('div');
        root.id = 'seller-coupon-portal';
        document.body.appendChild(root);
    }
    return root;
};

const SellerCouponCheckout = ({
    couponData,
    couponError,
    couponLoading,
    triggerLabel = 'View Seller Coupons',
    onSelectCoupon,
    onTriggerRender, // optional custom trigger renderer
    autoOpen = false, // auto open modal when mounted
    closeOnClaim = true // close after claiming
}) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(null);

    const items = couponData?.sellerCoupons?.items || [];

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const handleClaim = async (item) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(item.code);
            }
        } catch (_) {
            /* ignore */
        }
        setCopied(item.code);
        setTimeout(() => setCopied(null), 2000);
        if (onSelectCoupon) onSelectCoupon(item);
        if (closeOnClaim) handleClose();
    };

    // Auto open behavior
    useEffect(() => {
        if (autoOpen && !open) {
            setOpen(true);
        }
    }, [autoOpen, open]);

    const modal = open ? (
        <div className={modalClasses.overlay} role="dialog" aria-modal="true" aria-label="Seller coupons list">
            <div className={modalClasses.backdrop} onClick={handleClose} />
            <div className={modalClasses.dialog}>
                <div className={modalClasses.header}>
                    <h2 className={modalClasses.title}>Seller Coupons</h2>
                    <button type="button" className={modalClasses.closeBtn} onClick={handleClose} aria-label="Close coupon modal">×</button>
                </div>
                <div className={modalClasses.body}>
                    {couponLoading && <p className={listClasses.metaText}>Loading coupons...</p>}
                    {!couponLoading && couponError && <p className={listClasses.metaText}>Failed to load coupons.</p>}
                    {!couponLoading && !couponError && !items.length && <p className={listClasses.metaText}>No coupons available.</p>}
                    {!couponLoading && !couponError && items.length > 0 && (
                        <div className={modalClasses.stack}>
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
                                    <div key={key} className={listClasses.card} role="group" aria-label={`Coupon ${item.code}`}>
                                        <div className={listClasses.perf} aria-hidden="true" />
                                        <div className={listClasses.content}>
                                            <div className={listClasses.title}>{title}</div>
                                            <div className={listClasses.subtext}>Code: <span className={listClasses.code}>{item.code}</span></div>
                                            <div className={listClasses.expiry}>{expiryLabel}</div>
                                        </div>
                                        <div className={listClasses.divider} aria-hidden="true" />
                                        <div className={listClasses.actions}>
                                            <button
                                                type="button"
                                                className={listClasses.claimBtn}
                                                onClick={() => handleClaim(item)}
                                                aria-label={`Claim coupon ${item.code}`}
                                            >
                                                {copied === item.code ? 'Copied' : 'Claim'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;

    const trigger = onTriggerRender
        ? onTriggerRender({ open, setOpen, handleOpen })
        : (
            <button
                type="button"
                className={modalClasses.triggerBtn}
                onClick={handleOpen}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                {triggerLabel}
            </button>
        );

    return <>{onTriggerRender ? trigger : trigger}{open ? ReactDOM.createPortal(modal, getPortalRoot()) : null}</>;
};

export default SellerCouponCheckout;
