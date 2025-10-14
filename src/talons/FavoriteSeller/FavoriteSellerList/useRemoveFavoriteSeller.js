import { useMutation } from '@apollo/client';
import gqls from './favoriteSellerList.gql';

/**
 * Custom hook untuk menghapus seller dari favorite list
 * @returns { removeSeller, loading, error, data }
 */
const useRemoveFavoriteSeller = () => {
    const [removeSeller, { loading, error, data }] = useMutation(
        gqls.removeSellerFromFavoriteListMutation
    );

    /**
     * @param {Array<string|number>} sellerIds - Array of seller_id yang ingin dihapus
     * @returns {Promise}
     */
    const remove = (sellerIds) => {
        return removeSeller({
            variables: { sellerIds }
        });
    };

    return {
        remove,
        loading,
        error,
        data
    };
};

export default useRemoveFavoriteSeller;
