import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './shopByBrands.gql';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useShopByBrands = props => {

    const { searchQuery, activeFilter, active, setActive, currentSort, categoryId, shopby } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getShopByBrandsDataQuery, getCategoryContentQuery, getFilterInputsQuery } = operations;
    const { pathname, search } = useLocation();

    const [runQuery, queryResponse] = useLazyQuery(getShopByBrandsDataQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pathnameArr = pathname.split('/');
    
    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    
    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    const { data: introspectionData } = useQuery(getFilterInputsQuery);

    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);
    
    const filters = getFiltersFromSearch(search);

    // Construct the filter arg object.
    const newFilters = {};
    filters.forEach((values, key) => {
        newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
    });

    useEffect(() => {
        runQuery({
            variables: {
                filters: newFilters,
                categoryUrlKey: categoryUrlKey,
                attributeCode: shopby,
                activeFilter: activeFilter
            }
        });
    }, [
        runQuery,
        activeFilter,
        shopby
    ]);

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    const originalDataResult = useMemo(() => {
        if (!queryResponse) {
            return null;
        }
        
        const rawData = queryResponse?.data?.shopByBrands;
        if (!rawData) {
            return null;
        }
        
        let options = rawData?.options;

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
    }, [queryResponse]);

    const filteredOptions = useMemo(() => {
        if (!queryResponse) {
            return null;
        }
        
        const rawData = queryResponse?.data?.shopByBrands;
        if (!rawData) {
            return null;
        }
        
        let options = rawData.options;

        if (searchQuery) {
            if (active != "all") {
                setActive('all');
            }

            return options.filter(function(option) {
                return option.name.search(new RegExp(searchQuery, "i")) != -1;
            });
        }

        return options;
    }, [queryResponse, searchQuery]);

    const dataResult = useMemo(() => {
        if (filteredOptions) {
            return filteredOptions.reduce((acc, item) => {
                let firstLetter = item.name.charAt(0).toUpperCase();
                if (!alpha.includes(firstLetter)) {
                    firstLetter = '#';
                }

                acc[firstLetter] = acc[firstLetter] || [];
                acc[firstLetter].push(item);
                return acc;
            }, {});
        }

        return filteredOptions;
    }, [filteredOptions])

    let availableGroups = originalDataResult ? Object.keys(originalDataResult).sort() : [];
    let filteredAvailableGroups = dataResult ? Object.keys(dataResult).sort() : [];

    const attributeData = queryResponse?.data?.shopByBrands && queryResponse?.data?.shopByBrands.length ? queryResponse.data.shopByBrands[0] : null

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
        dataResult,
        filteredAvailableGroups,
        categoryUrlSuffix,
        categoryUrlKey,
        availableGroups,
        attributeData,
        alpha,
        category
    };
};
