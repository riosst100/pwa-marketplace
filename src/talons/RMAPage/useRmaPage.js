import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';

import operations from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/RMAPage/rmaPage.gql';

const PAGE_SIZE = 5;

// Custom RMA Page talon with page-based pagination
export const useRmaPage = (props = {}) => {
    const { rmaId, orderNumber } = props;
    const { getLofmpRmasQuery, getLofmpRmaDetailQuery, lofmpCreateRmaMutation, lofmpRmaShippingConfirmMutation, lofmpSendRmaMessageMutation } = operations;

    // Mutation for sending RMA message
    const [sendRmaMessageMutation, { data: sendRmaMessageData, error: sendRmaMessageError, loading: sendRmaMessageLoading }] = useMutation(lofmpSendRmaMessageMutation);

    // Handler for sending RMA message
    const sendRmaMessage = useCallback(async (input) => {
        try {
            const { data } = await sendRmaMessageMutation({ variables: { input } });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }, [sendRmaMessageMutation]);

    // Mutation for creating RMA
    const [createRmaMutation, { data: createRmaData, error: createRmaError, loading: createRmaLoading }] = useMutation(lofmpCreateRmaMutation);

    // Mutation for confirming shipping
    const [confirmShippingMutation, { data: confirmShippingData, error: confirmShippingError, loading: confirmShippingLoading }] = useMutation(lofmpRmaShippingConfirmMutation);

    // Handler for creating RMA
    const createRma = useCallback(async (input) => {
        try {
            const { data } = await createRmaMutation({ variables: { input } });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }, [createRmaMutation]);

    // Handler for confirming shipping
    const confirmShipping = useCallback(async (rma_id) => {
        try {
            const { data } = await confirmShippingMutation({ variables: { rma_id } });
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }, [confirmShippingMutation]);

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

    // List query (skipped when viewing detail)
    const { data, error, loading } = useQuery(getLofmpRmasQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: orderNumber
                ? { order_number: orderNumber }
                : (searchText ? { order_number: searchText } : undefined),
            pageSize,
            currentPage
        },
        skip: !!rmaId
    });

    // Detail query (only when rmaId provided)
    const {
        data: rmaDetailData,
        error: rmaDetailError,
        loading: rmaDetailLoading,
        refetch: refetchRmaDetail
    } = useQuery(getLofmpRmaDetailQuery, {
        fetchPolicy: 'cache-and-network',
        variables: { rmaId },
        skip: !rmaId,
        pollInterval: 3000 // 1 detik auto-refresh
    });

    const rmasData = data && data.lofmpRmas ? data.lofmpRmas : undefined;
    const rmas = rmasData && rmasData.items ? rmasData.items : [];
    const totalCount = rmasData && typeof rmasData.total_count !== 'undefined' && rmasData.total_count !== null
        ? rmasData.total_count
        : 0;
    // Use page_info.total_pages if available, fallback to manual calculation
    const totalPagesFromData = rmasData && rmasData.page_info && typeof rmasData.page_info.total_pages !== 'undefined'
        ? rmasData.page_info.total_pages
        : (totalCount ? Math.ceil(totalCount / pageSize) : null);

    // Keep pagination total pages in sync with query result
    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => setTotalPages(null);
    }, [setTotalPages, totalPagesFromData]);

    const isLoadingWithoutData = rmaId ? (!rmaDetailData && rmaDetailLoading) : (!data && loading);
    const isBackgroundLoading = rmaId ? (!!rmaDetailData && rmaDetailLoading) : (!!data && loading);

    const pageInfo = useMemo(() => {
        if (!rmaId && data) {
            const currentShown = Math.min(currentPage * pageSize, totalCount);
            return { current: currentShown, total: totalCount };
        }
        return null;
    }, [rmaId, data, currentPage, pageSize, totalCount]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([rmaId ? rmaDetailError : error]),
        [rmaId, rmaDetailError, error]
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
        loadMoreRmas: null,
        rmas,
        pageInfo,
        searchText,
        pageControl,
        createRma,
        createRmaLoading,
        createRmaError,
        createRmaData,
        confirmShipping,
        confirmShippingLoading,
        confirmShippingError,
        confirmShippingData,
        rmaDetail: rmaDetailData ? rmaDetailData.lofmpRmaDetail : undefined,
        rmaDetailLoading,
        rmaDetailError,
        refetchRmaDetail
        ,sendRmaMessage, sendRmaMessageData, sendRmaMessageError, sendRmaMessageLoading
    };
};

export default useRmaPage;
