import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

import operations from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/TrackOrder/trackOrder.gql';

export const useTrackOrder = (props = {}) => {
	const { incrementId } = props;
	const { getTrackOrderQuery } = operations;

	const [
		,
		{
			actions: { setPageLoading }
		}
	] = useAppContext();

	const {
		data,
		error,
		loading,
		refetch
	} = useQuery(getTrackOrderQuery, {
		fetchPolicy: 'cache-and-network',
		variables: { increment_id: incrementId },
		skip: !incrementId
	});

	const isLoadingWithoutData = !data && loading;
	const isBackgroundLoading = !!data && loading;

	// Update the page indicator if the GraphQL query is in flight.
	useEffect(() => {
		setPageLoading(isBackgroundLoading);
	}, [isBackgroundLoading, setPageLoading]);

	const derivedErrorMessage = useMemo(
		() => deriveErrorMessage([error]),
		[error]
	);

	return {
		errorMessage: derivedErrorMessage,
		isLoadingWithoutData,
		isBackgroundLoading,
		trackOrder: data ? data.trackOrder : undefined,
		refetchTrackOrder: refetch
	};
};

export default useTrackOrder;
