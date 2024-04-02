import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './customFilters.gql';

import { useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useCustomFilters = props => {
    // const { filters } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCustomFilters, getFilterInputsQuery, getStoreConfigQuery } = operations;

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [runQuery, queryResponse] = useLazyQuery(getCustomFilters, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const {
        called: called,
        loading: customFiltersLoading,
        error,
        data
    } = queryResponse;
    
    const { pathname, search } = useLocation();

    const {
        called: introspectionCalled,
        data: introspectionData,
        loading: introspectionLoading
    } = useQuery(getFilterInputsQuery);

    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    useEffect(() => {

        if (!filterTypeMap.size) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
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
        runQuery,
        filterTypeMap,
        search
    ]);

    const customFiltersData = customFiltersLoading && !data ? null : (data ? data.customSubFilters : null);

    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix;
        }
    }, [storeConfigData]);

    return {
        customFiltersData: customFiltersData || [],
        categoryUrlSuffix,
        search,
        pathname
    };
};
