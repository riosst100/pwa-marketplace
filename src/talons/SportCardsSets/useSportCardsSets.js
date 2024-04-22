import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './sportCardsSets.gql';

export const useSportCardsSets = props => {

    const { searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getSportCardsSetsQuery, getCategoryContentQuery } = operations;
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
    const parentCategoryUrlKey = pathnameArr[pathnameArr.length - 2].replace('.html','');
    const productType = shopby;
    
    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    const { error, loading, data } = useQuery(getSportCardsSetsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            categoryUrlKey: categoryUrlKey,
            setType: setType
        }
    });

    // console.log(data)

    const isBackgroundLoading = !!data && loading;

    const availableLeagues = [];

    const sportCardsSets = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const sportCardsSets = data.sportCardsSets;
        if (!sportCardsSets) {
            return null;
        }

        const sortbyData = [];
        // if (activeTab == 'year') {

        //     console.log(activeTab)
            sportCardsSets.map((setRelease, index) => {
                const { group, sets } = setRelease;
                if (sets.length) {
                    sets.map((set, index) => {
                        const { release_year, sc_league } = set;
                        if (sc_league) {
                            if (!availableLeagues.includes(sc_league)) {
                                availableLeagues.push(sc_league);
                            }
                        }
                        // if (release_year) {
                        //     // groupingSetsByYear.splice(release_year, 0, set);
                        //     const result = sortbyData.find(item => item.group === release_year);

                        //     // groupingSetsByYear[release_year] = set;
                        //     if (result) {
                        //         result.sets.push(set)
                        //     } else {
                        //         // if (sortby == "date" || sortby == "newest" && sortbyData.length < 2) {
                        //             sortbyData.push({
                        //                 'group': release_year,
                        //                 'sets': [set]
                        //             })
                        //         // }
                        //     }
                        // }
                    })
                }
            })
        // }

        return activeTab == "year" ? sortbyData && sortbyData.length ? sortbyData.sort((a, b) => b.group.toLowerCase().localeCompare(a.group.toLowerCase())) : sortbyData : sportCardsSets.slice().sort((a, b) => a.group.toLowerCase().localeCompare(b.group.toLowerCase()));
    }, [data, activeTab]);

    const availableGroups = sportCardsSets && sportCardsSets.length ? sportCardsSets.map(({ group }) => group) : [];

    // const availableLeagues = sportCardsSets && sportCardsSets.length ? sportCardsSets.map(({ sets }) => sportCardsSets.map(({ sc_league }) => sc_league)) : [];
// console.log(availableLeagues)
    // sc_league

    const filteredsportCardsSets = useMemo(() => {
        if (!sportCardsSets) {
            return null;
        }

        const filteredSets = [];

        if (searchQuery) {

            setActive('all')

            sportCardsSets.map(({ group, sets }, index) => {
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

        return searchQuery ? filteredSets : sportCardsSets;
    }, [sportCardsSets, searchQuery, sortby]);

    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

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
        sportCardsSets,
        filteredsportCardsSets,
        categoryUrlSuffix,
        categoryUrlKey,
        productType,
        availableGroups,
        category,
        // availableLeagues
    };
};
