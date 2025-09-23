import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './subCategoryPage.gql';

export const useSubCategoryPage = props => {

    const { searchQuery, setActive, categoryId } = props

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getCategoryContentQuery } = operations;

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: categoryData, loading, error } = useQuery(
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
    const children =
    categoryData && categoryData.categories.items.length
        ? categoryData.categories.items[0].children
        : null;

    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    const originalDataResult = useMemo(() => {
        if (!children) {
            return null;
        }

        const mappingData = children.reduce((acc, item) => {
            let firstLetter = item.name.charAt(0).toUpperCase();
            if (!alpha.includes(firstLetter)) {
                firstLetter = '#';
            }
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(item);
            return acc;
        }, {});

        return mappingData;
    }, [children, searchQuery]);

    const dataResult = useMemo(() => {
        if (!children) {
            return null;
        }
        
        if (!children) {
            return null;
        }
        
        let options = children;

        if (searchQuery) {
            setActive('all')
            options = options.filter(function(option) {
                return option.name.search(new RegExp(searchQuery, "i")) != -1;
            });
        }

        const mappingData = options.reduce((acc, item) => {
            let firstLetter = item.name.charAt(0).toUpperCase();
            if (!alpha.includes(firstLetter)) {
                firstLetter = '#';
            }
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(item);
            return acc;
        }, {});

        return mappingData;
    }, [children, searchQuery]);

    const availableGroups = originalDataResult ? Object.keys(originalDataResult).sort() : [];
    const filteredAvailableGroups = dataResult ? Object.keys(dataResult).sort() : [];

    return {
        error,
        loading,
        dataResult,
        filteredAvailableGroups,
        categoryUrlSuffix,
        availableGroups,
        alpha,
        category
    };
};
