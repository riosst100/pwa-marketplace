import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './rfq.gql';

import { useLocation } from 'react-router-dom';

export const useRFQ = props => {
	const { pathname } = useLocation();
	const rfqQuoteId = pathname.split('/')[2];

	const operations = mergeOperations(DEFAULT_OPERATIONS, props?.operations);

	const {
		getQuickRfqListQuery,
		getQuickRfqDetailQuery,
		createQuickRfqMutation,
		sendRfqMessageMutation,
		convertQuickrfqToCartMutation,
		createCartMutation
	} = operations;

	const [fetchRfqList, rfqListState] = useLazyQuery(getQuickRfqListQuery, {
		fetchPolicy: 'network-only',
		nextFetchPolicy: 'cache-first'
	});

	const [fetchRfqDetail, rfqDetailState] = useLazyQuery(getQuickRfqDetailQuery, {
		fetchPolicy: 'network-only',
		nextFetchPolicy: 'cache-first',
		notifyOnNetworkStatusChange: true,
		errorPolicy: 'all'
	});

	const [createQuickRfq, createState] = useMutation(createQuickRfqMutation);
	const [sendRfqMessage, sendMessageState] = useMutation(sendRfqMessageMutation);

	const [fetchCartId] = useMutation(createCartMutation);
	// const [convertQuickrfqToCart, convertState] = useMutation(convertQuickrfqToCartMutation);
	
	const convertState = null;

	const [
        convertQuickrfqToCart,
        {
            data: addToCartResponseData,
            error: errorAddingProductToCart,
            loading: isAddProductLoading
        }
    ] = useMutation(convertQuickrfqToCartMutation);

	const loadRfqList = useCallback(
		variables => fetchRfqList({ variables }),
		[fetchRfqList]
	);

	const loadRfqDetail = useCallback(
		variables => {
			const id = variables && variables.quickrfqId;
			const parsedId = typeof id === 'number' ? id : parseInt(id, 10);
			if (isNaN(parsedId)) {
				return Promise.resolve(null);
			}
			return fetchRfqDetail({ variables: { quickrfqId: parsedId } });
		},
		[fetchRfqDetail]
	);

	const handleCreateQuickRfq = useCallback(
		input => createQuickRfq({ variables: { input } }),
		[createQuickRfq]
	);

	const handleSendRfqMessage = useCallback(
		input => sendRfqMessage({ variables: { input } }),
		[sendRfqMessage]
	);

	const handleConvertQuickrfqToCart = useCallback(() => {
		convertQuickrfqToCart({ variables: { quickrfqId: rfqQuoteId } })
	}, [convertQuickrfqToCart, rfqQuoteId]);

	return {
		fetchCartId,
		addToCartResponseData, 
		isAddProductLoading, 
		errorAddingProductToCart,
		loadRfqList,
		rfqListState,
		loadRfqDetail,
		rfqDetailState,
		startDetailPolling: rfqDetailState && rfqDetailState.startPolling ? rfqDetailState.startPolling : undefined,
		stopDetailPolling: rfqDetailState && rfqDetailState.stopPolling ? rfqDetailState.stopPolling : undefined,
		handleCreateQuickRfq,
		createState,
		handleSendRfqMessage,
		sendMessageState,
		handleConvertQuickrfqToCart,
		convertState
	};
};

export default useRFQ;
