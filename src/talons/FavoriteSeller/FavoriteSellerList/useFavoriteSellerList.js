import { useQuery } from '@apollo/client';
import gqls from './favoriteSellerList.gql';

/**
 * Custom hook untuk mengambil daftar seller yang di-follow user
 * @param {Object} options - Opsi query Apollo (filter, pageSize, currentPage)
 */
const useFavoriteSellerList = (options = {}) => {
    const { filter = {}, pageSize = 20, currentPage = 1 } = options;
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

    return {
        data: data?.favoritelist,
        loading,
        error,
        refetch
    };
};

export default useFavoriteSellerList;
