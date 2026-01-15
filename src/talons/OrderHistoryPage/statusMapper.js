// Unified status mapping for grouping (tabs) and row labels

// Normalize backend status string to a comparable token
export const normalizeStatus = (status) => {
    if (!status || typeof status !== 'string') return '';
    return status.trim().toLowerCase().replace(/\s+/g, '_');
};

// Sets of backend statuses
export const PROCESSING_STATUSES = new Set([
    'pending',
    'pending_payment',
    'pending_paypal',
    'processing',
    'payment_review',
    'on_hold',
    'suspected_fraud',
    'insufficient_inventory',
    'paypal_reversed',
    'paypal_canceled_reversal'
]);

export const COMPLETE_STATUSES = new Set(['complete', 'closed']);
export const CANCELED_STATUSES = new Set(['canceled', 'cancel']);

// Group name constants
export const GROUPS = {
    ALL: 'ALL',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    COMPLETE: 'Complete',
    CANCELED: 'Canceled'
};

// Determine tab grouping for an order based on backend status and shipments
export const getOrderGroup = (status, shipments = []) => {
    const s = normalizeStatus(status);
    if (CANCELED_STATUSES.has(s)) return GROUPS.CANCELED;
    if (COMPLETE_STATUSES.has(s)) return GROUPS.COMPLETE;
    // Derived shipped: has shipments and in processing group
    const hasShipment = Array.isArray(shipments) && shipments.length > 0;
    if (hasShipment && PROCESSING_STATUSES.has(s)) return GROUPS.SHIPPED;
    // Default to processing group
    if (PROCESSING_STATUSES.has(s)) return GROUPS.PROCESSING;
    // Unknown statuses: treat as processing to avoid hiding
    return GROUPS.PROCESSING;
};

// Friendly label for the row header from backend status
export const getRowStatusLabel = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
        case 'pending': return 'Pending';
        case 'pending_payment': return 'Pending Payment';
        case 'pending_paypal': return 'Pending PayPal';
        case 'processing': return 'Processing';
        case 'payment_review': return 'Payment Review';
        case 'on_hold': return 'On Hold';
        case 'suspected_fraud': return 'Suspected Fraud';
        case 'insufficient_inventory': return 'Insufficient Inventory';
        case 'paypal_reversed': return 'PayPal Reversed';
        case 'paypal_canceled_reversal': return 'PayPal Canceled Reversal';
        case 'complete': return 'Complete';
        case 'closed': return 'Closed';
        case 'canceled':
        case 'cancel':
            return 'Canceled';
        default: {
            // Fallback: title-case original status string
            if (!status) return 'Processing';
            try {
                const title = String(status)
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());
                return title;
            } catch (_) {
                return 'Processing';
            }
        }
    }
};
