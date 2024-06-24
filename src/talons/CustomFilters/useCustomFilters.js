import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './customFilters.gql';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';


import { useFilterState } from '@magento/peregrine/lib/talons/FilterModal';
import {
    getFiltersFromSearch,
    getFilterInput,
    getSearchFromState,
    getStateFromSearch,
    sortFiltersArray,
    stripHtml
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useCustomFilters = props => {
    const { filters, category } = props;

    const [isApplying, setIsApplying] = useState(false);
    const [filterState, filterApi] = useFilterState();

    const attributeCodes = useMemo(
        () => filters.map(({ attribute_code }) => attribute_code),
        [filters]
    );

    const history = useHistory();

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

    console.log(category)

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
        search,
        category
    ]);

    const customFiltersData = customFiltersLoading && !data ? null : (data ? data.customSubFilters : null);

    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix;
        }
    }, [storeConfigData]);

    // Create a set of disabled filters.
    const DISABLED_FILTERS = useMemo(() => {
        const disabled = new Set();
        // Disable category filtering when not on a search page.
        if (pathname !== '/search.html') {
            // disabled.add('category_id');
            // disabled.add('category_uid');
        }

        return disabled;
    }, [pathname]);

    const possibleFilters = useMemo(() => {
        const nextFilters = new Set();
        const inputFields = introspectionData
            ? introspectionData.__type.inputFields
            : [];

        // perform mapping and filtering in the same cycle
        for (const { name } of inputFields) {
            const isValid = attributeCodes.includes(name);
            const isEnabled = !DISABLED_FILTERS.has(name);

            if (isValid && isEnabled) {
                nextFilters.add(name);
            }
        }

        return nextFilters;
    }, [DISABLED_FILTERS, attributeCodes, introspectionData]);

    const isBooleanFilter = options => {
        const optionsString = JSON.stringify(options);
        return (
            options.length <= 2 &&
            (optionsString.includes(
                JSON.stringify({
                    __typename: 'AggregationOption',
                    label: '0',
                    value: '0'
                })
            ) ||
                optionsString.includes(
                    JSON.stringify({
                        __typename: 'AggregationOption',
                        label: '1',
                        value: '1'
                    })
                ))
        );
    };

    const [
        filterNames,
        filterKeys,
        filterItems,
        filterFrontendInput
    ] = useMemo(() => {
        const names = new Map();
        const keys = new Set();
        const frontendInput = new Map();
        const itemsByGroup = new Map();

        const sortedFilters = sortFiltersArray([...filters]);

        for (const filter of sortedFilters) {
            const { options, label: name, attribute_code: group } = filter;

            // If this aggregation is not a possible filter, just back out.
            if (possibleFilters.has(group)) {
                const items = [];

                // add filter name
                names.set(group, name);

                // add filter key permutations
                keys.add(`${group}[filter]`);

                // TODO: Get all frontend input type from gql if other filter input types are needed
                // See https://github.com/magento-commerce/magento2-pwa/pull/26
                if (isBooleanFilter(options)) {
                    frontendInput.set(group, 'boolean');
                    // add items
                    items.push({
                        title: 'No',
                        value: '0',
                        label: name + ':' + 'No'
                    });
                    items.push({
                        title: 'Yes',
                        value: '1',
                        label: name + ':' + 'Yes'
                    });
                } else {
                    // Add frontend input type
                    frontendInput.set(group, null);
                    // add items
                    for (const { label, value, path } of options) {
                        items.push({ title: stripHtml(label), value, path });
                    }
                }
                itemsByGroup.set(group, items);
            }
        }

        return [names, keys, itemsByGroup, frontendInput];
    }, [filters, possibleFilters]);

    useEffect(() => {
        if (isApplying) {
            const nextSearch = getSearchFromState(
                search,
                filterKeys,
                filterState
            );

            // write filter state to history
            history.push({ pathname, search: nextSearch });

            // mark the operation as complete
            setIsApplying(false);
        }
    }, [filterKeys, filterState, history, isApplying, pathname, search]);

    const handleApply = useCallback(() => {
        setIsApplying(true);
    }, []);

    const handleReset = useCallback(() => {
        filterApi.clear();
        setIsApplying(true);
    }, [filterApi, setIsApplying]);

    return {
        customFiltersData: customFiltersData || [],
        categoryUrlSuffix,
        search,
        pathname,
        filterApi,
        // filterItems,
        // filterKeys,
        // filterNames,
        // filterFrontendInput,
        filterState,
        handleApply,
        handleReset
    };
};
