import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './shopBy.gql';

export const useShopBy = props => {

    const { searchQuery, setActive, currentSort, categoryId, shopby } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getShopByDataQuery, getCategoryContentQuery } = operations;
    const { pathname } = useLocation();
    // const [
    //     ,
    //     {
    //         actions: { setPageLoading }
    //     }
    // ] = useAppContext();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pathnameArr = pathname.split('/');
    
    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    
    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    const { error, loading, data } = useQuery(getShopByDataQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            categoryUrlKey: categoryUrlKey,
            attributeCode: shopby
        }
    });

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    // const isBackgroundLoading = !!data && loading;

    const originalDataResult = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const rawData = data.shopByData;
        if (!rawData) {
            return null;
        }
        
        let options = rawData[0].options;

        const mappingData = options.reduce((acc, item) => {
            let firstLetter = item.label.charAt(0).toUpperCase();
            if (!alpha.includes(firstLetter)) {
                firstLetter = '#';
            }
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(item);
            return acc;
        }, {});

        const sortbyData = [];

        return sortby != "all" ? sortbyData && sortbyData.length ? sortbyData.sort((a, b) => b.release_type.toLowerCase().localeCompare(a.release_type.toLowerCase())) : sortbyData : mappingData;
    }, [data, sortby, searchQuery]);

    const dataResult = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const rawData = data.shopByData;
        if (!rawData) {
            return null;
        }
        
        let options = rawData[0].options;

        if (searchQuery) {
            setActive('all')
            options = options.filter(function(option) {
                return option.label.search(new RegExp(searchQuery, "i")) != -1;
            });
        }

        const mappingData = options.reduce((acc, item) => {
            let firstLetter = item.label.charAt(0).toUpperCase();
            if (!alpha.includes(firstLetter)) {
                firstLetter = '#';
            }
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(item);
            return acc;
        }, {});

        const sortbyData = [];

        return sortby != "all" ? sortbyData && sortbyData.length ? sortbyData.sort((a, b) => b.release_type.toLowerCase().localeCompare(a.release_type.toLowerCase())) : sortbyData : mappingData;
    }, [data, sortby, searchQuery]);

    const availableGroups = originalDataResult ? Object.keys(originalDataResult).sort() : [];

    const filteredAvailableGroups = dataResult ? Object.keys(dataResult).sort() : [];


    const attributeData = data ? data.shopByData[0] : null

    const { data: categoryData, loading: categoryLoading } = useQuery(
        getCategoryContentQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            skip: !categoryId,
            variables: {
                id: categoryId
            }
        }
    );

    const category =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0]
            : null;

    return {
        error,
        loading,
        dataResult,
    //     collectibleGameSets,
        filteredAvailableGroups,
        categoryUrlSuffix,
        categoryUrlKey,
        availableGroups,
        attributeData,
        alpha,
        category
    //     productType
    };
};
