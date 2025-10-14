import { gql } from '@apollo/client';

export const GET_FAVORITE_SELLER_LIST = gql`
    query GetFavoriteSellerList($filter: FavoriteFilterInput, $pageSize: Int, $currentPage: Int) {
        favoritelist(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
            items {
                creation_time
                customer_id
                id
                seller {
                    description
                    name
                    seller_id
                    url
                }
                status
            }
            page_info {
                current_page
                page_size
                total_pages
            }
            total_count
        }
    }
`;

export const REMOVE_SELLER_FROM_FAVORITE_LIST = gql`
    mutation RemoveSellerFromFavoriteList($sellerIds: [ID]!) {
        removeSellerToFavoritelist(sellerIds: $sellerIds) {
            error
            favorite {
                creation_time
                customer {
                    customer_id
                    name
                }
                customer_id
                id
                status
            }
        }
    }
`;

export default {
    getFavoriteSellerListQuery: GET_FAVORITE_SELLER_LIST,
    removeSellerFromFavoriteListMutation: REMOVE_SELLER_FROM_FAVORITE_LIST
};
