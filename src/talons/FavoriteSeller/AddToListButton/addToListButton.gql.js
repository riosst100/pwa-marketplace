import { gql } from '@apollo/client';

export const ADD_TO_FAVORITE_SELLER_LIST = gql`
    mutation AddSellerToFavoriteList(
        $sellerId: ID!
    ) {
        addSellerToFavoritelist(
            sellerId: $sellerId
        ) {
            favorite {
                id
                customer_id
                creation_time
                status
            }
            error
        }
    }
`;

export const GET_SELLER_IN_FAVORITE_LISTS = gql`
    query GetProductsInWishlistsForGallery {
        customerWishlistProducts @client
    }
`;

export default {
    addToFavoriteSellerMutation: ADD_TO_FAVORITE_SELLER_LIST,
    getSellerInFavoriteListsQuery: GET_SELLER_IN_FAVORITE_LISTS
};
