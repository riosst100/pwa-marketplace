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

export default {
	createProductReview: CREATE_PRODUCT_REVIEW,
	getProductReviewRatingsMetadata: GET_PRODUCT_REVIEW_RATINGS_METADATA
};
