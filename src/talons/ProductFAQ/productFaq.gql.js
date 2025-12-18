import { gql } from '@apollo/client';

export const GET_PRODUCT_FAQ_LIST_QUERY = gql`
	query getProductFaqList($productId: Int!) {
		productFaqList(product_id: $productId) {
			question_id
			seller_id
			customer_name
			customer_email
			category_id
			store_id
			title
			title_size
			title_color
			title_background
			border_width
			border_color
			border_radius
			body_color
			body_background
			margin_bottom
			margin_left
			icon
			answer
			status
			position
			creation_time
			update_time
			meta_keywords
			meta_description
			page_title
		}
	}
`;

export default {
	getProductFaqListQuery: GET_PRODUCT_FAQ_LIST_QUERY,
};

