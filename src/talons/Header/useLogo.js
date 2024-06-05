import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './logo.gql';
import { useQuery } from '@apollo/client';

export const useLogo = props => {

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfig } = operations;
    const { data, loading, error } = useQuery(getStoreConfig, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    return {
        error,
        data,
        loading
    };
};
