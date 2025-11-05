import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';

import operations from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/OrderHistoryPage/orderHistoryPage.gql';

const PAGE_SIZE = 5;

// Custom Order History talon with page-based pagination
export const useOrderHistoryPage = (props = {}) => {
    const { getCustomerOrdersQuery } = operations;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [pageSize] = useState(PAGE_SIZE);
    const [searchText, setSearchText] = useState('');

    // Pagination state
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage = 1, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const { data, error, loading } = useQuery(getCustomerOrdersQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                number: {
                    match: searchText
                }
            },
            pageSize,
            currentPage
        }
    });

    const ordersData = data && data.customer ? data.customer.orders : undefined;
    const orders = ordersData && ordersData.items ? ordersData.items : [];
    const totalCount = ordersData && typeof ordersData.total_count !== 'undefined' && ordersData.total_count !== null
        ? ordersData.total_count
        : 0;
    const totalPagesFromData = ordersData && ordersData.page_info && typeof ordersData.page_info.total_pages !== 'undefined'
        ? ordersData.page_info.total_pages
        : null;

    // Keep pagination total pages in sync with query result
    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => setTotalPages(null);
    }, [setTotalPages, totalPagesFromData]);

    const isLoadingWithoutData = !data && loading;
    const isBackgroundLoading = !!data && loading;

    const pageInfo = useMemo(() => {
        if (data) {
            const currentShown = Math.min(currentPage * pageSize, totalCount);
            return {
                current: currentShown,
                total: totalCount
            };
        }
        return null;
    }, [data, currentPage, pageSize, totalCount]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([error]),
        [error]
    );

    const handleReset = useCallback(() => {
        setSearchText('');
        setCurrentPage(1);
    }, [setCurrentPage]);

    const handleSubmit = useCallback(
        ({ search }) => {
            setSearchText(search);
            setCurrentPage(1);
        },
        [setCurrentPage]
    );

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    const pageControl = useMemo(
        () => ({ currentPage, setPage: setCurrentPage, totalPages }),
        [currentPage, setCurrentPage, totalPages]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreOrders: null,
        orders,
        pageInfo,
        searchText,
        pageControl
    };
};

export default useOrderHistoryPage;
