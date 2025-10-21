import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useRef } from 'react';
import gqls from './favoriteSellerList.gql';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';

/**
 * Custom hook untuk mengambil daftar seller yang di-follow user
 * @param {Object} options - Opsi query Apollo (filter, pageSize, currentPage)
 */
const useFavoriteSellerList = (options = {}) => {
    const { filter = {}, pageSize = 4 } = options;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage = 1, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    
    const { data, loading, error, refetch } = useQuery(
        gqls.getFavoriteSellerListQuery,
        {
            variables: {
                filter,
                pageSize,
                currentPage
            },
            fetchPolicy: 'cache-and-network'
        }
    );

    const totalPagesFromData = data
        ? data.favoritelist?.page_info?.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    return {
        data: data?.favoritelist,
        loading,
        error,
        refetch,
        totalPagesFromData,
        pageControl
    };
};

export default useFavoriteSellerList;
