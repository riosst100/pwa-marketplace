import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './showMore.gql';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useShowMore = props => {

    const { searchQuery, activeFilter, active, setActive, currentSort, categoryId, shopby } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getShopByDataQuery, getCategoryContentQuery, getFilterInputsQuery } = operations;
    const { pathname, search } = useLocation();
    // const [
    //     ,
    //     {
    //         actions: { setPageLoading }
    //     }
    // ] = useAppContext();

    const [runQuery, queryResponse] = useLazyQuery(getShopByDataQuery, {
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

    const activeFilters = [];

    // if (!filterTypeMap.size) {
    //     return;
    // }

    const filters = getFiltersFromSearch(search);

    // Construct the filter arg object.
    const newFilters = {};
    filters.forEach((values, key) => {
        newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        
        if (key == "sc_baseball_release") {
            for(let item of values) {
                if(item) {
                    // console.log(item.split(',')[0])
                    const data = search.split('&');
                    data.pop();
                    activeFilters.push(
                        {
                            'label': item.split(',')[0],
                            'path': data
                        }
                    )
                }   
            }
        }
    });

    useEffect(() => {

        

        // Use the category uid for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        // newFilters['category_uid'] = { eq: id };

        runQuery({
            variables: {
                filters: newFilters,
                categoryUrlKey: categoryUrlKey,
                attributeCode: shopby,
                activeFilter: activeFilter,
                search: search
            }
        });
    }, [
        runQuery,
        activeFilter,
        shopby,
        // categoryUrlKey,
        // filters
        // filterTypeMap,
        search
    ]);

    // console.log(activeFilters)

    

    // const { error, loading, data } = useQuery(getShopByDataQuery, {
    //     fetchPolicy: 'cache-and-network',
    //     nextFetchPolicy: 'cache-first',
    //     skip: !storeConfigData,
    //     variables: {
    //         categoryUrlKey: categoryUrlKey,
    //         attributeCode: shopby
    //     }
    // });

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    // const isBackgroundLoading = !!queryResponse && loading;

    const originalDataResult = useMemo(() => {
        if (!queryResponse) {
            return null;
        }
        
        const rawData = queryResponse?.data?.showMoreData?.data;
        if (!rawData) {
            return null;
        }
        
        let options = rawData[0].options;

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
        
        const rawData = queryResponse?.data?.showMoreData?.data;
        if (!rawData) {
            return null;
        }
        
        let options = rawData[0].options;

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
        // } else {

        //     console.log(filteredOptions)

           
        // }

        

        // const sortbyData = [];

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
    }, [filteredOptions])

    // console.log(dataResult)

    let availableGroups = originalDataResult ? Object.keys(originalDataResult).sort() : [];

    let filteredAvailableGroups = dataResult ? Object.keys(dataResult).sort() : [];
    
    if (shopby == "vehicles_year" || shopby == "trains_gauge" || shopby == "vehicles_scale" || shopby == "lego_theme" || shopby == "lego_subtheme" || shopby == "lego_interest") {
        availableGroups = ['#'];
        filteredAvailableGroups = ['#'];
    }


    const attributeData = queryResponse?.data?.showMoreData?.data && queryResponse?.data?.showMoreData.data.length ? queryResponse.data.showMoreData.data[0] : null

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

        return queryResponse?.data?.showMoreData?.page_info;
    }, [queryResponse]);

    const category =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0]
            : null;

    const isLoading = useMemo(() => {
        return !queryResponse || queryResponse && queryResponse.loading ? true : false;
    }, [queryResponse]);

    return {
        // error,
        loading: isLoading,
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