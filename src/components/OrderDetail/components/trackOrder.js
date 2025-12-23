import React, { useMemo, useState } from 'react';
import { TickCircle } from 'iconsax-react';
import { useIntl } from 'react-intl';

import useTrackOrder from '@riosst100/pwa-marketplace/src/talons/TrackOrder/useTrackOrder';

const TrackOrder = ({ order }) => {
    const incrementId = useMemo(() => {
        const num = order?.number;
        return typeof num === 'number' ? String(num) : (num || '');
    }, [order]);

    const { trackOrder, isLoadingWithoutData, isBackgroundLoading, errorMessage } = useTrackOrder({ incrementId });

    const { formatMessage, locale } = useIntl();

    const status = (order?.status || '').toLowerCase();
    const delivered = status === 'complete';
    const canceled = status === 'canceled' || status === 'cancel' || status === 'cancelled';
    const inTransit = !canceled && status !== '' && !delivered;

    const summary = trackOrder?.summary;
    const manifests = Array.isArray(trackOrder?.manifest)
        ? trackOrder.manifest
        : (trackOrder?.manifest ? [trackOrder.manifest] : []);

    const activeManifestIndex = useMemo(() => {
        if (!manifests.length) return -1;
        let bestIdx = 0;
        let bestTime = -Infinity;
        manifests.forEach((m, idx) => {
            const d = m?.manifest_date;
            const t = m?.manifest_time;
            const dt = d && t ? new Date(`${d}T${t}`) : undefined;
            const time = dt && !isNaN(dt) ? dt.getTime() : NaN;
            if (!isNaN(time) && time > bestTime) {
                bestTime = time;
                bestIdx = idx;
            }
        });
        return isFinite(bestTime) ? bestIdx : 0;
    }, [manifests]);

    const formatManifestDate = m => {
        const d = m?.manifest_date;
        const t = m?.manifest_time;
        if (d && t) {
            const dt = new Date(`${d}T${t}`);
            if (!isNaN(dt)) {
                try {
                    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(dt);
                } catch (e) {
                    return dt.toLocaleString();
                }
            }
        }
        return [t || '', d || ''].filter(Boolean).join(' ') || '-';
    };

    const [copied, setCopied] = useState(false);
    const handleCopyWaybill = () => {
        const text = summary?.waybill_number;
        if (!text) return;
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                })
                .catch(() => {});
        }
    };

    const loading = isLoadingWithoutData || isBackgroundLoading;
    return (
        <div className="block-content rounded-md border border-gray-100 px-4 py-6 relative" aria-busy={loading}>
            <div className="relative h-12 mb-6">
                <div className="absolute left-0 right-0 top-[10px] flex">
                    <div className={`h-[2px] w-1/2 rounded-l-full ${inTransit || delivered ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                    <div className={`h-[2px] w-1/2 rounded-r-full ${delivered ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                </div>
                <div className="absolute left-0 right-0 top-[10px] flex justify-between">
                    <div className="flex flex-col items-center">
                        <span className={`w-3 h-3 rounded-full -translate-y-1/2 ring-2 ring-white shadow ${inTransit || delivered ? 'bg-blue-700' : 'bg-gray-100'} ${inTransit ? 'animate-pulse' : ''}`}></span>
                        <span className={`mt-2 text-sm ${inTransit || delivered ? 'text-blue-700 font-medium' : 'text-gray-200'}`}>{formatMessage({ id: 'order.track.inTransit', defaultMessage: 'In Transit' })}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className={`w-5 h-5 rounded-full -translate-y-1/2 flex items-center justify-center ring-2 ring-white shadow transition-transform duration-300 ${delivered ? 'bg-green-500 scale-110' : (delivered || inTransit ? 'bg-blue-700' : 'bg-gray-100')}`}>
                            {delivered && <TickCircle size={14} color="#ffffff" variant="Bold" />}
                        </span>
                        <span className={`mt-2 text-sm ${delivered ? 'text-green-600 font-medium' : 'text-gray-200'}`}>{formatMessage({ id: 'order.track.delivered', defaultMessage: 'Delivered' })}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
                {summary && (
                    <div className="flex flex-col gap-2">
                        <div className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs w-[250px]">
                            <strong>{formatMessage({ id: 'order.track.courier', defaultMessage: 'Courier' })}:</strong> {summary.courier_name || '-'}
                        </div>
                        <div className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs w-[250px] flex items-center justify-between">
                            <div className="truncate" title={summary.waybill_number || ''}>
                                <strong>{formatMessage({ id: 'order.track.waybill', defaultMessage: 'Waybill' })}:</strong> {summary.waybill_number || '-'}
                            </div>
                            {summary.waybill_number && (
                                <button type="button" onClick={handleCopyWaybill} className="ml-2 px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700">
                                    {copied ? formatMessage({ id: 'common.copied', defaultMessage: 'Copied!' }) : formatMessage({ id: 'common.copy', defaultMessage: 'Copy' })}
                                </button>
                            )}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs w-[250px] ${summary.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            <strong>{formatMessage({ id: 'order.track.status', defaultMessage: 'Status' })}:</strong> {summary.status || '-'}
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <div className="text-red-600 text-sm">{errorMessage}</div>
                )}
            </div>

            {manifests.length > 0 && (
                <div className="relative flex flex-col gap-4">
                    <div className="pointer-events-none absolute left-[4px] top-0 bottom-0 border-l border-gray-100"></div>
                    {manifests.map((m, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full z-10 ${idx === activeManifestIndex ? 'bg-blue-700' : 'bg-gray-100'}`}></div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-800">{m?.manifest_description || '-'}</div>
                                {m?.city_name && (
                                    <div className="text-xs text-gray-500">{m.city_name}</div>
                                )}
                                <div className="text-xs text-gray-500">{formatManifestDate(m)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {loading && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin"></span>
                        <span className="text-sm text-gray-700">{formatMessage({ id: 'order.track.loading', defaultMessage: 'Loading tracking order…' })}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrder;