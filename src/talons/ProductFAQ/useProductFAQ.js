import { useLazyQuery } from '@apollo/client';
import { useCallback } from 'react';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './productFaq.gql';

export const useProductFAQ = props => {
	const operations = mergeOperations(DEFAULT_OPERATIONS, props?.operations);
	const { getProductFaqListQuery } = operations;

	const [fetchProductFaqList, productFaqListState] = useLazyQuery(
		getProductFaqListQuery,
		{
			fetchPolicy: 'network-only',
			nextFetchPolicy: 'cache-first',
			notifyOnNetworkStatusChange: true,
			errorPolicy: 'all'
		}
	);

	const loadProductFaqList = useCallback(
		variables => {
			const id = variables && variables.productId;
			const parsedId = typeof id === 'number' ? id : parseInt(id, 10);
			if (isNaN(parsedId)) {
				return Promise.resolve(null);
			}
			return fetchProductFaqList({ variables: { productId: parsedId } });
		},
		[fetchProductFaqList]
	);

	return {
		loadProductFaqList,
		productFaqListState,
		startPolling:
			productFaqListState && productFaqListState.startPolling
				? productFaqListState.startPolling
				: undefined,
		stopPolling:
			productFaqListState && productFaqListState.stopPolling
				? productFaqListState.stopPolling
				: undefined
	};
};

export default useProductFAQ;

