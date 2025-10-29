import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './shopBy.gql';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useShopBy = props => {

    const { searchQuery, activeFilter, active, setActive, currentSort, categoryId, shopby } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getShopByDataQuery, getCategoryContentQuery, getFilterInputsQuery, getProductFiltersByCategoryQuery, getMasterAttributesQuery } = operations;
    const { pathname, search } = useLocation();
    // const [
    //     ,
    //     {
    //         actions: { setPageLoading }
    //     }
    // ] = useAppContext();

    const [runQuery, { data: queryResponse, loading, error }] = useLazyQuery(
        getProductFiltersByCategoryQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    // const [runQuery, {data: queryResponse, loading, error}] = useLazyQuery(getShopByDataQuery, {
    //     fetchPolicy: 'cache-and-network',
    //     nextFetchPolicy: 'cache-first'
    // });

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

    const { newFilters, activeFilters } = useMemo(() => {
        const resultFilters = {};
        const resultActiveFilters = [];

        if (filterTypeMap.size) {
            filters.forEach((values, key) => {
                resultFilters[key] = getFilterInput(values, filterTypeMap.get(key));

                if (key === "sc_baseball_release") {
                    for (let item of values) {
                        if (item) {
                            const data = search.split('&');
                            data.pop();
                            resultActiveFilters.push({
                                label: item.split(',')[0],
                                path: data
                            });
                        }
                    }
                }
            });
        }

        return { newFilters: resultFilters, activeFilters: resultActiveFilters };
    }, [filterTypeMap]);

    // MASTER ATTRIBUTES
    const {
        called: masterAttributesCalled,
        data: masterAttributesData,
        loading: masterAttributesLoading
    } = useQuery(getMasterAttributesQuery,
    {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const masterAttributes = useMemo(() => {
        const masterAttributes = [];
        
        if (masterAttributesData) {
            masterAttributesData.masterAttributes.forEach(({ attribute_code }) => {
                masterAttributes.push(attribute_code);
            });
        }

        return masterAttributes;
    }, [masterAttributesData]);

    useEffect(() => {

        if (!filterTypeMap.size) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        const mainAttributes = ['card_game'];

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            if (mainAttributes.includes(key)) {
                newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
            }
        });

        // Use the category uid for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        // newFilters['category_uid'] = { eq: id };

        runQuery({
            variables: {
                filters: newFilters
            }
        });
    }, [
        runQuery, filterTypeMap, search
    ]);

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    // const isBackgroundLoading = !!queryResponse && loading;

    const originalDataResult = useMemo(() => {
        if (!queryResponse) {
            return null;
        }
        
        const rawData = queryResponse?.products?.aggregations;
        if (!rawData.length) {
            return null;
        }

        let options = rawData.find(item => item.attribute_code === shopby).options;

        const mappingData = options.reduce((acc, item) => {
            let firstLetter = item.label.charAt(0).toUpperCase();
            if (!alpha.includes(firstLetter)) {
                firstLetter = '#';
            }
            if (shopby == "vehicles_year" || shopby == "trains_gauge" || shopby == "vehicles_scale" || shopby == "lego_theme" || shopby == "lego_subtheme" || shopby == "lego_interest") {
                firstLetter = '#';
            }
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(item);
            return acc;
        }, {});

        const sortbyData = [];

        return sortby != "all" ? sortbyData && sortbyData.length ? sortbyData.sort((a, b) => b.release_type.toLowerCase().localeCompare(a.release_type.toLowerCase())) : sortbyData : mappingData;
    }, [queryResponse, sortby]);

    const filteredOptions = useMemo(() => {
        if (!queryResponse) {
            return null;
        }
        
        const rawData = queryResponse?.products?.aggregations;
        if (!rawData.length) {
            return null;
        }

        let options = rawData.find(item => item.attribute_code === shopby).options;

        // const filteredSets = [];

        // let filteredOptions = [];

        // let mappingData = [];

        if (searchQuery) {
            if (active != "all") {
                setActive('all');
            }

            return options.filter(function(option) {
                return option.label.search(new RegExp(searchQuery, "i")) != -1;
            });
        }

        return options;
    }, [queryResponse, searchQuery]);

    const dataResult = useMemo(() => {
        if (filteredOptions) {
            return filteredOptions.reduce((acc, item) => {
                let firstLetter = item.label.charAt(0).toUpperCase();
                if (!alpha.includes(firstLetter)) {
                    firstLetter = '#';
                }
                if (shopby == "vehicles_year" || shopby == "trains_gauge" || shopby == "vehicles_scale" || shopby == "lego_theme" || shopby == "lego_subtheme" || shopby == "lego_interest") {
                    firstLetter = '#';
                }
                acc[firstLetter] = acc[firstLetter] || [];
                acc[firstLetter].push(item);
                return acc;
            }, {});
        }

        return filteredOptions;
    }, [filteredOptions]);

    let availableGroups = originalDataResult ? Object.keys(originalDataResult).sort() : [];

    let filteredAvailableGroups = dataResult ? Object.keys(dataResult).sort() : [];
    
    if (shopby == "vehicles_year" || shopby == "trains_gauge" || shopby == "vehicles_scale" || shopby == "lego_theme" || shopby == "lego_subtheme" || shopby == "lego_interest") {
        availableGroups = ['#'];
        filteredAvailableGroups = ['#'];
    }


    const attributeData = queryResponse?.products?.aggregations && queryResponse?.products.aggregations.length ? queryResponse.products.aggregations.find(item => item.attribute_code === shopby) : null;

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

    const pageInfo = useMemo(() => {
        if (!queryResponse) {
            return null;
        }

        return queryResponse.products.aggregations.find(item => item.attribute_code === shopby);
    }, [queryResponse, shopby]);

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
        category,
        activeFilters,
        pageInfo
    //     productType
    };
};
