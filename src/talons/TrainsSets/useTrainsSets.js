import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './trainsSets.gql';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useTrainsSets = props => {

    const { searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab, activeFilter } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getTrainsSetsQuery, getCategoryContentQuery, getFilterInputsQuery } = operations;
    const { pathname, search } = useLocation();
    const [runQuery, queryResponse] = useLazyQuery(getTrainsSetsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pathnameArr = pathname.split('/');

    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    const parentCategoryUrlKey = pathnameArr[pathnameArr.length - 2].replace('.html','');
    const productType = shopby;
    
    

    // const { error, loading, data } = useQuery(getTrainsSetsQuery, {
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
    });

    useEffect(() => {
        runQuery({
            variables: {
                filters: newFilters,
                categoryUrlKey: categoryUrlKey,
                activeTab: activeTab,
                shopby: shopby,
                activeFilter: activeFilter
            }
        });
    // }
    }, [
        runQuery
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

    const trainsSets = useMemo(() => {
        if (!queryResponse) {
            return null;
        }

        // console.log(data)
        
        const trainsSets = queryResponse?.data?.trainsSets;
        if (!trainsSets) {
            return null;
        }

        return trainsSets.slice().sort((a, b) =>a.group.toLowerCase().localeCompare(b.group.toLowerCase()));
    }, [queryResponse]);

    const availableGroups = trainsSets && trainsSets.length ? trainsSets.map(({ group }) => group) : [];

    // const availableLeagues = trainsSets && trainsSets.length ? trainsSets.map(({ sets }) => trainsSets.map(({ sc_league }) => sc_league)) : [];
// console.log(availableLeagues)
    // sc_league

    const filteredTrainsSets = useMemo(() => {
        if (!trainsSets) {
            return null;
        }

        let filteredSets = [];

        

        if (activeFilter) {
            trainsSets.map(({ group, sets }, index) => {
                const newSets = sets.filter(function(set) {
                    // console.log(activeFilter + ' dan '+set.trains_gauge)
                    // console.log(set.trains_gauge.search(new RegExp(activeFilter, "i")) != -1)
                    if (activeTab == "country") {
                        return set.country == activeFilter;
                    }
                    
                    if (activeTab == "trains_gauge") {
                        return set.trains_gauge.search(new RegExp('<'+activeFilter+'>', "i")) != -1;
                    }

                    return false;
                });

                if (newSets && newSets.length) {
                    filteredSets.push({
                        'group': group,
                        'sets': newSets
                    })
                }
            })
        }

        let targetTrainsSets = trainsSets;

        if (searchQuery) {

            if (activeFilter) {
                targetTrainsSets = filteredSets
                filteredSets = [];
            }

            // useEffect(() => {
            //     setActive('all')
            // }, [active]);

            targetTrainsSets.map(({ group, sets }, index) => {
                const newSets = sets.filter(function(set) {
                    return set.set_name.search(new RegExp(searchQuery, "i")) != -1 || group.search(new RegExp(searchQuery, "i")) != -1;
                    // return set.set_name.includes(searchQuery);
                });

                if (newSets && newSets.length) {
                    filteredSets.push({
                        'group': group,
                        'sets': newSets
                    })
                }
            })
        }

        return searchQuery || activeFilter ? filteredSets : trainsSets;
    }, [trainsSets, searchQuery, activeFilter]);

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

    // console.log(trainsSets)

    return {
        error,
        loading,
        trainsSets,
        filteredTrainsSets,
        categoryUrlSuffix,
        categoryUrlKey,
        productType,
        availableGroups,
        category,
        // availableLeagues
    };
};
