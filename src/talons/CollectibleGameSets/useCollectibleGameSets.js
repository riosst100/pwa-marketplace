import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './collectibleGameSets.gql';

export const useCollectibleGameSets = props => {

    const { searchQuery, setActive, currentSort, shopby } = props

    const { value: sortby } = currentSort

    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getStoreConfigData, getCollectibleGameQuery } = operations;
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

    // console.log(sortby)

    const pathnameArr = pathname.split('/');

    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    const productType = shopby;
    
    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    const { error, loading, data } = useQuery(getCollectibleGameQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            categoryUrlKey: categoryUrlKey,
            productType: productType
        }
    });

    const isBackgroundLoading = !!data && loading;

    const collectibleGameSets = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const collectibleGameSets = data.collectibleGameSets;
        if (!collectibleGameSets) {
            return null;
        }

        // console.log(sortby)

        const sortbyData = [];
        if (sortby != 'all') {
            collectibleGameSets.map((setRelease, index) => {
                const { release_type, sets } = setRelease;
                if (sets.length) {
                    sets.map((set, index) => {
                        const { release_year } = set;
                        if (release_year) {
                            // groupingSetsByYear.splice(release_year, 0, set);
                            const result = sortbyData.find(item => item.release_type === release_year);

                            // console.log(result)
                            // groupingSetsByYear[release_year] = set;
                            if (result) {
                                result.sets.push(set)
                            } else {
                                if (sortby == "date" || sortby == "newest" && sortbyData.length < 2) {
                                    sortbyData.push({
                                        'release_type': release_year,
                                        'sets': [set]
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }

        return sortby != "all" ? sortbyData && sortbyData.length ? sortbyData.sort((a, b) => b.release_type.toLowerCase().localeCompare(a.release_type.toLowerCase())) : sortbyData : collectibleGameSets.slice().sort((a, b) => a.release_type.toLowerCase().localeCompare(b.release_type.toLowerCase()));
    }, [data, sortby]);

    const availableGroups = collectibleGameSets && collectibleGameSets.length ? collectibleGameSets.map(({ release_type }) => release_type) : [];

    // console.log(collectibleGameSets)

    const filteredCollectibleGameSets = useMemo(() => {
        if (!collectibleGameSets) {
            return null;
        }

        const filteredSets = [];

        if (searchQuery) {

            setActive('all')

            collectibleGameSets.map(({ release_type, sets }, index) => {

                // console.log(sets)
                const newSets = sets.filter(function(set) {
                    return set.set_name.search(new RegExp(searchQuery, "i")) != -1 || set.set_abbreviation.search(new RegExp(searchQuery, "i")) != -1 || release_type.search(new RegExp(searchQuery, "i")) != -1;
                    // return set.set_name.includes(searchQuery);
                });

                if (newSets && newSets.length) {
                    filteredSets.push({
                        'release_type': release_type,
                        'sets': newSets
                    })
                }
            })

            // console.log(filteredSets)
        }

        return searchQuery ? filteredSets : collectibleGameSets;
    }, [collectibleGameSets, searchQuery, sortby]);

    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        error,
        loading,
        collectibleGameSets,
        filteredCollectibleGameSets,
        categoryUrlSuffix,
        categoryUrlKey,
        productType,
        availableGroups
    };
};
