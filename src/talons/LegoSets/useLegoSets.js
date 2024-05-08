import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './legoSets.gql';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useLegoSets = props => {

    const { searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab, activeFilter } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getLegoSetsQuery, getCategoryContentQuery, getFilterInputsQuery } = operations;
    const { pathname, search } = useLocation();
    const [runQuery, queryResponse] = useLazyQuery(getLegoSetsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pathnameArr = pathname.split('/');

    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    const parentCategoryUrlKey = pathnameArr[pathnameArr.length - 2].replace('.html','');
    const productType = shopby;
    
    

    // const { error, loading, data } = useQuery(getLegoSetsQuery, {
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
        // console.log("MASUK")

        // if (queryResponse.data) {

        

        // Use the category uid for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        // newFilters['category_uid'] = { eq: id };

        runQuery({
            variables: {
                filters: newFilters,
                categoryUrlKey: categoryUrlKey,
                activeTab: activeTab
            }
        });
    // }
    }, [
        runQuery,
        activeTab
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

    // { data: queryResponse, error, loading }

    

    // console.log(data)

    // const isBackgroundLoading = !!data && loading;

    const availableLeagues = [];

    // console.log(queryResponse.data)

    const legoSets = useMemo(() => {
        if (!queryResponse) {
            return null;
        }

        // console.log(data)
        
        const legoSets = queryResponse?.data?.legoSets;
        if (!legoSets) {
            return null;
        }

        return legoSets.slice().sort((a, b) =>a.group.toLowerCase().localeCompare(b.group.toLowerCase()));
    }, [queryResponse]);

    const availableGroups = legoSets && legoSets.length ? legoSets.map(({ group }) => group) : [];

    // const availableLeagues = legoSets && legoSets.length ? legoSets.map(({ sets }) => legoSets.map(({ sc_league }) => sc_league)) : [];
// console.log(availableLeagues)
    // sc_league

    const filteredLegoSets = useMemo(() => {
        if (!legoSets) {
            return null;
        }

        const filteredSets = [];

        if (searchQuery) {

            // useEffect(() => {
            //     setActive('all')
            // }, [active]);

            legoSets.map(({ group, sets }, index) => {
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

        return searchQuery ? filteredSets : legoSets;
    }, [legoSets, searchQuery]);

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

    // console.log(legoSets)

    return {
        error,
        loading,
        legoSets,
        filteredLegoSets,
        categoryUrlSuffix,
        categoryUrlKey,
        productType,
        availableGroups,
        category,
        // availableLeagues
    };
};
