import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './setsData.gql';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useSetsData = props => {

    const { setsFilters, searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab, activeFilter, activeYear } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getSetsDataQuery, getCategoryContentQuery, getFilterInputsQuery } = operations;
    const { pathname, search } = useLocation();
    const [runQuery, queryResponse] = useLazyQuery(getSetsDataQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pathnameArr = pathname.split('/');

    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    const parentCategoryUrlKey = pathnameArr[pathnameArr.length - 2].replace('.html','');
    const productType = shopby;
    
    const { data: introspectionData,loading: introspectionLoading,error: introspectionDataError } = useQuery(getFilterInputsQuery, {
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

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
    // const newFilters = {};
    // filters.forEach((values, key) => {
    //     newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
    //     if (key == "sc_baseball_release") {
    //         for(let item of values) {
    //             if(item) {
    //                 const data = search.split('&');
    //                 data.pop();
    //                 activeFilters.push(
    //                     {
    //                         'label': item.split(',')[0],
    //                         'path': data
    //                     }
    //                 )
    //             }   
    //         }
    //     }
    // });
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

    useEffect(() => {
        // if (queryResponse.data) {

        

        // Use the category uid for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        // newFilters['category_uid'] = { eq: id };

        runQuery({
            variables: {
                filters: newFilters,
                categoryUrlKey: pathname,
                activeTab: activeTab,
                set_filters: setsFilters,
                shopby: shopby,
                activeFilter: activeFilter
            }
        });
    // }
    }, [
        runQuery,
        activeTab,
        activeFilter,
        setsFilters,
        // queryResponse
        // filterTypeMap,
        // search,
        newFilters,
        // shopby,
        // categoryUrlKey
    ]);

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    // { data: queryResponse, error, loading }

    

    // console.log(data)

    // const isBackgroundLoading = !!data && loading;

    const availableLeagues = [];

    // console.log(queryResponse.data)

    const setsData = useMemo(() => {
        if (!queryResponse) {
            return null;
        }

        // console.log(data)
        
        const setsData = queryResponse?.data?.getSetsData?.data;
        if (!setsData) {
            return null;
        }

        // return setsData.slice().sort((a, b) =>a.group.toLowerCase().localeCompare(b.group.toLowerCase()));
        return setsData;
    }, [queryResponse]);

    // const availableGroups = setsData && setsData.length ? setsData.map(({ group }) => group) : [];
    const availableGroups = useMemo(() => {
        if (!setsData) {
            return null;
        }

        const groups = [];

        setsData.map(({ group, release_year, sets }, index) => {
            // const newSets = sets.filter(function(set) {
            //     return set.set_name.search(new RegExp(searchQuery, "i")) != -1 || group.search(new RegExp(searchQuery, "i")) != -1;
            //     // return set.set_name.includes(searchQuery);
            // });

            // if (newSets && newSets.length) {
            //     filteredSets.push({
            //         'group': group,
            //         'sets': newSets
            //     })
            // }
            if (activeYear && activeYear == release_year) {
                groups.push(group)
            }
        })

        return groups;
    }, [setsData, activeYear]);
    let availableYears = setsData && setsData.length 
    ? [...new Set(setsData.map(({ release_year }) => release_year))].sort((a, b) => b - a)
    : [];
    // let availableYears = setsData && setsData.length ? setsData.map(({ release_year }) => release_year) : [];
    // availableYears = availableYears && availableYears.length ? availableYears.slice().sort((a, b) =>a.group.toLowerCase().localeCompare(b.group.toLowerCase())) : [];
    // const groupByYears = setsData && setsData.length ? setsData.map(({ group,release_year }) => release_year) : [];

    // console.log('availableYears')
    // console.log(availableYears)

    // const availableLeagues = setsData && setsData.length ? setsData.map(({ sets }) => setsData.map(({ sc_league }) => sc_league)) : [];
// console.log(availableLeagues)
    // sc_league
    const attributeData = useMemo(() => {
        if (!queryResponse) {
            return null;
        }

        return queryResponse?.data?.getSetsData?.attribute;
    }, [queryResponse]);

    const availableFilters = useMemo(() => {
        if (!queryResponse) {
            return null;
        }

        return queryResponse?.data?.getSetsData?.available_filters;
    }, [queryResponse]);

    const pageInfo = useMemo(() => {
        if (!queryResponse) {
            return null;
        }

        return queryResponse?.data?.getSetsData?.page_info;
    }, [queryResponse]);

    const filteredSetsData = useMemo(() => {
        if (!setsData) {
            return null;
        }

        const filteredSets = [];

        if (searchQuery) {

            // useEffect(() => {
            //     setActive('all')
            // }, [active]);

            setsData.map(({ group, release_year, sets }, index) => {
                const newSets = sets.filter(function(set) {
                    return set.set_name && set.set_name.search(new RegExp(searchQuery, "i")) != -1 || group && group.search(new RegExp(searchQuery, "i")) != -1;
                    // return set.set_name.includes(searchQuery);
                });

                if (newSets && newSets.length) {
                    filteredSets.push({
                        'group': group,
                        'release_year': release_year,
                        'sets': newSets
                    })
                }
            })
        }

        if (!searchQuery && activeYear) {
            setsData.map(({ group, release_year, sets }, index) => {
                if (activeYear == release_year) {
                    filteredSets.push({
                        'group': group,
                        'release_year': release_year,
                        'sets': sets
                    })
                }
            })
        }

        return searchQuery || activeYear ? filteredSets : setsData;
    }, [setsData, searchQuery, activeYear]);

    // useEffect(() => {
    //     setPageLoading(isBackgroundLoading);
    // }, [isBackgroundLoading, setPageLoading]);

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

    const error = queryResponse?.error;
    const loading = queryResponse?.loading;

    return {
        error,
        loading,
        setsData,
        filteredSetsData,
        categoryUrlSuffix,
        categoryUrlKey,
        productType,
        availableGroups,
        availableYears,
        category,
        attributeData,
        availableFilters,
        pageInfo
    };
};
