import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './collectibleGameSets.gql';

export const useCollectibleGameSets = props => {

    const { product_type } = props

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getCollectibleGameQuery } = operations;
    const { pathname } = useLocation();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pathnameArr = pathname.split('/');

    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    const productType = product_type ? product_type : 'singles';
    
    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    const { error, loading, data } = useQuery(getCollectibleGameQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            categoryUrlKey: categoryUrlKey,
            productType: productType
        }
    });

    const isBackgroundLoading = !!data && loading;

    const collectibleGameSets = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const collectibleGameSets = data.collectibleGameSets;

        if (!collectibleGameSets) {
            return null;
        }

        return collectibleGameSets;
    }, [data, categoryUrlKey]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        error,
        loading,
        collectibleGameSets,
        categoryUrlSuffix,
        categoryUrlKey,
        productType
    };
};
