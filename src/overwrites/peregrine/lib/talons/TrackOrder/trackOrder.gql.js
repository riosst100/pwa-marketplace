import { gql } from '@apollo/client';

export const GET_TRACK_ORDER = gql`
	query GetTrackOrder($increment_id: String!) {
		trackOrder(increment_id: $increment_id) {
			delivered
			summary {
				courier_name
				waybill_number
				status
			}
			manifest {
				manifest_description
				manifest_date
                city_name
                manifest_time
			}
		}
	}
`;

export default {
	getTrackOrderQuery: GET_TRACK_ORDER
};
