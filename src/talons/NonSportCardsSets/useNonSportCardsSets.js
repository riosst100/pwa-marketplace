import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './nonSportCardsSets.gql';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useNonSportCardsSets = props => {

    const { searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab, activeFilter } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getNonSportCardsSetsQuery, getCategoryContentQuery, getFilterInputsQuery } = operations;
    const { pathname, search } = useLocation();
    const [runQuery, queryResponse] = useLazyQuery(getNonSportCardsSetsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pathnameArr = pathname.split('/');

    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    const parentCategoryUrlKey = pathnameArr[pathnameArr.length - 2].replace('.html','');
    const productType = shopby;
    
    

    // const { error, loading, data } = useQuery(getNonSportCardsSetsQuery, {
    //     fetchPolicy: 'cache-and-network',
    //     nextFetchPolicy: 'cache-first',
    //     skip: !storeConfigData,
    //     variables: {
    //         categoryUrlKey: categoryUrlKey,
    //         setType: setType
    //     }
    // });
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

    // console.log(search)

    // Construct the filter arg object.
    const newFilters = {};
    filters.forEach((values, key) => {
        newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
// console.log(key)
// console.log(values)
        
        if (key == "sc_baseball_release") {
            for(let item of values) {
                if(item) {
                    // console.log(item.split(',')[0])
                    const data = search.split('&');
                    data.pop();
                    // activeFilters.push(
                    //     {
                    //         'label': item.split(',')[0],
                    //         'path': data
                    //     }
                    // )
                }   
            }
        }
    });

    useEffect(() => {
        // console.log("MASUK")

        // if (queryResponse.data) {

        

        // Use the category uid for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        // newFilters['category_uid'] = { eq: id };

        runQuery({
            variables: {
                filters: newFilters,
                categoryUrlKey: categoryUrlKey,
                setType: setType,
                shopby: shopby
            }
        });
    // }
    }, [
        runQuery,
        // queryResponse
        // filterTypeMap,
        // search,
        // newFilters,
        // shopby,
        // categoryUrlKey
    ]);

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    const nonSportCardsSets = useMemo(() => {
        if (!queryResponse) {
            return null;
        }
        
        const nonSportCardsSets = queryResponse?.data?.nonSportCardsSets;
        if (!nonSportCardsSets) {
            return null;
        }

        // const sortbyData = [];
        // if (nonSportCardsSets) {
        // nonSportCardsSets.map((setRelease, index) => {
        //     const { group, sets } = setRelease;
        //     if (sets.length) {
        //         sets.map((set, index) => {
        //             const { release_year } = set;
        //             // if (release_year) {
        //             //     // groupingSetsByYear.splice(release_year, 0, set);
        //                 // const result = sortbyData.find(item => item.group === release_year);

        //             //     // groupingSetsByYear[release_year] = set;
        //             //     if (result) {
        //             //         result.sets.push(set)
        //             //     } else {
        //             //         // if (sortby == "date" || sortby == "newest" && sortbyData.length < 2) {
        //             //             sortbyData.push({
        //             //                 'group': release_year,
        //             //                 'sets': [set]
        //             //             })
        //             //         // }
        //             //     }
        //             // }
        //         })
        //     }
        // })

        return nonSportCardsSets.slice().sort((a, b) => b.group.toLowerCase().localeCompare(a.group.toLowerCase()));
    }, [queryResponse]);

    const availableGroups = nonSportCardsSets && nonSportCardsSets.length ? nonSportCardsSets.map(({ group }) => group) : [];

    const filteredNonSportCardsSets = useMemo(() => {
        if (!nonSportCardsSets) {
            return null;
        }

        const filteredSets = [];

        if (searchQuery) {

            // setActive('all')

            nonSportCardsSets.map(({ group, sets }, index) => {
                const newSets = sets.filter(function(set) {
                    return set.set_name.search(new RegExp(searchQuery, "i")) != -1 || group.search(new RegExp(searchQuery, "i")) != -1;
                });

                if (newSets && newSets.length) {
                    filteredSets.push({
                        'group': group,
                        'sets': newSets
                    })
                }
            })
        }

        // if (activeFilter && activeFilter != "all") {
        //     nonSportCardsSets.map(({ group, sets }, index) => {
        //         const newSets = sets.filter(function(set) {
        //             return set.sc_league == activeFilter;
        //             // return set.set_name.includes(searchQuery);
        //         });

        //         if (newSets && newSets.length) {
        //             filteredSets.push({
        //                 'group': group,
        //                 'sets': newSets
        //             })
        //         }
        //     })
        // }

        return searchQuery ? filteredSets : nonSportCardsSets;
    }, [nonSportCardsSets, searchQuery]);

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
        nonSportCardsSets,
        filteredNonSportCardsSets,
        categoryUrlSuffix,
        categoryUrlKey,
        productType,
        availableGroups,
        category
    };
};
