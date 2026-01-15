import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';

import operations from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/OrderHistoryPage/orderHistoryPage.gql';
import { GROUPS, getOrderGroup } from './statusMapper';

const PAGE_SIZE = 10;

// Custom Order History talon with page-based pagination
export const useOrderHistoryPage = (props = {}) => {
    const { getCustomerOrdersQuery } = operations;
    const client = useApolloClient();

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [pageSize] = useState(PAGE_SIZE);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Pagination state
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage = 1, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    // GraphQL schema only supports filtering by order number.
    // We will apply status filtering on the client side (current page results).
    const filterVariables = useMemo(() => {
        const q = typeof searchText === 'string' ? searchText.trim() : '';
        // When search is empty, omit filter entirely to fetch full dataset
        return q ? { number: { match: q } } : undefined;
    }, [searchText]);

    const { data, error, loading, refetch } = useQuery(getCustomerOrdersQuery, {
        // Force a fresh read when mounting/variables change to avoid partial cache
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
        variables: {
            filter: filterVariables,
            pageSize,
            // Always fetch from page 1; we'll aggregate all pages client-side
            currentPage: 1,
            sort: { sort_field: 'CREATED_AT', sort_direction: 'DESC' }
        }
    });

    const ordersData = data && data.customer ? data.customer.orders : undefined;
    const firstPageOrders = ordersData && ordersData.items ? ordersData.items : [];
    const serverTotalPages = ordersData && ordersData.page_info && typeof ordersData.page_info.total_pages !== 'undefined'
        ? ordersData.page_info.total_pages
        : 1;

    const [allOrders, setAllOrders] = useState([]);
    const [isAggregatingAll, setIsAggregatingAll] = useState(false);

    // Aggregate all pages on initial load or when search changes.
    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            // Base items from first query
            const baseItems = firstPageOrders || [];

            const totalPagesToFetch = serverTotalPages || 1;
            setIsAggregatingAll(true);
            const results = [];
            for (let p = 2; p <= totalPagesToFetch; p++) {
                try {
                    const res = await client.query({
                        query: getCustomerOrdersQuery,
                        fetchPolicy: 'network-only',
                        variables: {
                            filter: filterVariables,
                            pageSize,
                            currentPage: p,
                            sort: { sort_field: 'CREATED_AT', sort_direction: 'DESC' }
                        }
                    });
                    const items = res?.data?.customer?.orders?.items || [];
                    results.push(...items);
                } catch (e) {
                    // continue to next page even if one request fails/cancels
                    continue;
                }
            }
            if (!cancelled) {
                // Merge base + remaining pages and remove duplicates by order number (or id fallback)
                const merged = [...baseItems, ...results];
                const seen = new Set();
                const unique = [];
                for (const o of merged) {
                    const key = (o && (o.number || o.id)) || null;
                    if (!key) continue;
                    if (!seen.has(key)) {
                        seen.add(key);
                        unique.push(o);
                    }
                }
                // Defensive sort to keep stable across navigations
                const getSortKey = (o) => {
                    const od = typeof o?.order_date === 'string' ? o.order_date.trim() : '';
                    if (od) {
                        const iso = od.replace(' ', 'T');
                        const t = new Date(iso).getTime();
                        if (!isNaN(t)) return t;
                    }
                    const num = parseInt(o?.number, 10);
                    return isNaN(num) ? 0 : num;
                };
                unique.sort((a, b) => getSortKey(b) - getSortKey(a));
                setAllOrders(unique);
                setIsAggregatingAll(false);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [client, getCustomerOrdersQuery, filterVariables, pageSize, serverTotalPages]);

    const isLoadingWithoutData = !data && loading;
    const isBackgroundLoading = (!!data && loading) || isAggregatingAll;

    // Client-side status filtering for the aggregated results
    const filteredOrders = useMemo(() => {
        const src = allOrders || [];
        if (!src || statusFilter === GROUPS.ALL) return src;
        return src.filter(o => {
            const group = getOrderGroup(o?.status, o?.shipments);
            return group === statusFilter;
        });
    }, [allOrders, statusFilter]);

    const totalCount = filteredOrders.length;
    // Counts per tab across the full aggregated list
    const tabCounts = useMemo(() => {
        const src = allOrders || [];
        const counts = {
            ALL: src.length,
            Processing: 0,
            Shipped: 0,
            Complete: 0,
            Canceled: 0
        };
        for (const o of src) {
            const g = getOrderGroup(o?.status, o?.shipments);
            if (g && counts.hasOwnProperty(g)) counts[g] += 1;
        }
        return counts;
    }, [allOrders]);
    const pageInfo = useMemo(() => {
        const currentShown = Math.min(currentPage * pageSize, totalCount);
        return {
            current: currentShown,
            total: totalCount
        };
    }, [currentPage, pageSize, totalCount]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([error]),
        [error]
    );

    const handleReset = useCallback(() => {
        setSearchText('');
        setStatusFilter('ALL');
        setCurrentPage(1);
        // Force a fresh network fetch to ensure full dataset
        try {
            refetch({
                filter: undefined,
                pageSize,
                currentPage: 1,
                sort: { sort_field: 'CREATED_AT', sort_direction: 'DESC' }
            });
        } catch (_) { /* swallow */ }
    }, [setCurrentPage, refetch, pageSize]);

    const handleSubmit = useCallback(
        ({ search }) => {
            setSearchText(search);
            setCurrentPage(1);
        },
        [setCurrentPage]
    );

    // Update the page indicator if the GraphQL query is in flight or aggregation is running.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    // When coming back to the tab or focusing the window, ensure data is fresh.
    // This helps recover from any previously canceled network requests.
    useEffect(() => {
        const onFocus = () => {
            try {
                refetch({
                    filter: filterVariables,
                    pageSize,
                    currentPage: 1,
                    sort: { sort_field: 'CREATED_AT', sort_direction: 'DESC' }
                });
            } catch (_) { /* noop */ }
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [refetch, filterVariables, pageSize]);

    // Drive pagination off filtered orders length
    useEffect(() => {
        const tp = Math.max(1, Math.ceil(totalCount / pageSize));
        setTotalPages(tp);
        return () => setTotalPages(null);
    }, [totalCount, pageSize, setTotalPages]);

    const pageControl = useMemo(
        () => ({ currentPage, setPage: setCurrentPage, totalPages }),
        [currentPage, setCurrentPage, totalPages]
    );

    // (filteredOrders is already computed above across allOrders; below we only slice for the current page)

    return {
        errorMessage: derivedErrorMessage,
        handleReset,
        handleSubmit,
        setStatusFilter,
        statusFilter,
        isBackgroundLoading,
        isLoadingWithoutData,
        tabCounts,
        loadMoreOrders: null,
        // Slice filtered orders for the current page
        orders: useMemo(() => {
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            return filteredOrders.slice(start, end);
        }, [filteredOrders, currentPage, pageSize]),
        pageInfo,
        searchText,
        pageControl
    };
};

export default useOrderHistoryPage;
