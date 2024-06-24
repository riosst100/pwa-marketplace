import { gql } from '@apollo/client';

export const GET_SELLER_REVIEW_DATA = gql`
    query getSellerReviewData($sellerUrl: String!, $filter: SellerRatingFilterInput, $pageSize: Int, $currentPage: Int, $sort: SellerRatingSortInput) {
        sellerRatings(
            seller_url: $sellerUrl
            filter: $filter
            pageSize: $pageSize
            currentPage: $currentPage
            sort: $sort
        ) {
            total_count
            page_info {
                total_pages
                page_size
                current_page
            }
            items {
                rating_id
                seller_id
                customer_id
                rate1
                rate2
                rate3
                rate4
                rate5
                rating
                email
                title
                status
                detail
                nickname
                created_at
                verified_buyer
                is_recommended
                is_hidden
                answer
                admin_note
                like_about
                not_like_about
                guest_email
                plus_review
                minus_review
                report_abuse
                country
            }
        }
    }
`;

export default {
    getSellerReviewQuery: GET_SELLER_REVIEW_DATA
};
