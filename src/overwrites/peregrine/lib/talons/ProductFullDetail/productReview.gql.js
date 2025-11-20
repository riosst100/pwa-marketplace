import { gql } from '@apollo/client';

const GET_PRODUCT_REVIEW_RATINGS_METADATA = gql`
	query getProductReviewRatingsMetadata {
		productReviewRatingsMetadata {
			items {
				id
				name
				values {
					value
					value_id
				}
			}
		}
	}
`;

const CREATE_PRODUCT_REVIEW = gql`
	mutation CreateProductReview($input: CreateProductReviewInput!) {
		createProductReview(input: $input) {
			review {
				average_rating
				created_at
				nickname
				product {
					uuid: uid
					uid
					name
					sku
				}
				ratings_breakdown {
					name
					value
				}
				summary
				text
			}
		}
	}
`;

const GET_PRODUCT_REVIEWS = gql`
	query getProductReviews($url_key: String) {
		products(
			filter: { url_key: { eq: $url_key } }
			pageSize: 20
			currentPage: 1
		) {
			items {
				uid
				rating_summary
				review_count
				reviews(pageSize: 20, currentPage: 1){
					items {
						average_rating
						created_at
						nickname
						summary
						text
						product {
							uid
							name
							sku
						}
						ratings_breakdown {
							name
							value
						}
					}
					page_info {
						total_pages
						current_page
						page_size
					}
				}
			}
			page_info {
				total_pages
				current_page
			}
		}
	}
`;

export default {
	getProductReviews: GET_PRODUCT_REVIEWS,
	createProductReview: CREATE_PRODUCT_REVIEW,
	getProductReviewRatingsMetadata: GET_PRODUCT_REVIEW_RATINGS_METADATA
};
