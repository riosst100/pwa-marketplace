import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useFilterState } from '@magento/peregrine/lib/talons/FilterModal';
import { useLazyQuery, useQuery } from '@apollo/client';

import {
    getFiltersFromSearch,
    getFilterInput,
    getSearchFromState,
    getStateFromSearch,
    sortFiltersArray,
    stripHtml
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

import DEFAULT_OPERATIONS from './filterTop.gql';

const DRAWER_NAME = 'filter';

export const useFilterTop = props => {
    const { filters, category, shopby, filterBy, setFilterBy } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getFilterInputsQuery, getCustomFilters } = operations;

    const [runQuery, queryResponse] = useLazyQuery(getCustomFilters, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [isApplying, setIsApplying] = useState(false);
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const [filterState, filterApi] = useFilterState();
    const prevDrawer = useRef(null);
    const isOpen = drawer === DRAWER_NAME;

    const history = useHistory();
    const { pathname, search } = useLocation();

    const pathnameArr = pathname.split('/');

    // const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');

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
                filters: newFilters,
                category: category?.url_path,
                shopby: shopby,
                filterBy: filterBy,
                search: search
            }
        });
    }, [
        runQuery,
        filterTypeMap,
        search,
        category,
        filterBy
    ]);

    const attributeCodes = useMemo(
        () => filters.map(({ attribute_code }) => attribute_code),
        [filters]
    );

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

    // Get "allowed" filters by intersection of filter attribute codes and
    // schema input field types. This restricts the displayed filters to those
    // that the api will understand.
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

        nextFilters.add('card_print_version');

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

    const {
        called: called,
        loading: customFiltersLoading,
        error,
        data
    } = queryResponse;

    const customFiltersData = customFiltersLoading && !data ? null : (data ? data.customSubFilters : null);

    // useEffect(() => {
    //     if (data) {
    //         filters.concat(customFiltersData);
    //     }
    // }, [customFiltersData])

    // const customFilters = [];

    // iterate over filters once to set up all the collections we need
    const [
        filterNames,
        filterKeys,
        filterItems,
        filterFrontendInput,
        customFilters
    ] = useMemo(() => {
        const names = new Map();
        const keys = new Set();
        const frontendInput = new Map();
        const itemsByGroup = new Map();
        const customFiltersMap = [];
        
        if (customFiltersData && customFiltersData.filters) {
            customFiltersData.filters.map(({ attribute_code, options }, index) => {

                customFiltersMap.push(attribute_code)
                

                const items = [];

                names.set(attribute_code, '');
                frontendInput.set(attribute_code, null);

                // add filter key permutations
                keys.add(`${attribute_code}[filter]`);

                // add items
                for (const { label, value, path } of options) {
                    items.push({ title: stripHtml(label), value, path });
                }

                itemsByGroup.set(attribute_code, items);
            })
        }

        return [names, keys, itemsByGroup, frontendInput, customFiltersMap];
    }, [filters, customFiltersData, possibleFilters]);

    // on apply, write filter state to location
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

    const handleOpen = useCallback(() => {
        toggleDrawer(DRAWER_NAME);
    }, [toggleDrawer]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    const handleApply = useCallback(() => {
        setIsApplying(true);
        handleClose();
    }, [handleClose]);

    const handleReset = useCallback(() => {
        filterApi.clear();
        setIsApplying(true);
    }, [filterApi, setIsApplying]);

    const handleKeyDownActions = useCallback(
        event => {
            // do not handle keyboard actions when the modal is closed
            if (!isOpen) {
                return;
            }

            switch (event.keyCode) {
                // when "Esc" key fired -> close the modal
                case 27:
                    handleClose();
                    break;
            }
        },
        [isOpen, handleClose]
    );

    useEffect(() => {
        const justOpened =
            prevDrawer.current === null && drawer === DRAWER_NAME;
        const justClosed =
            prevDrawer.current === DRAWER_NAME && drawer === null;

        // on drawer toggle, read filter state from location
        if (justOpened || justClosed) {
            const nextState = getStateFromSearch(
                search,
                filterKeys,
                filterItems
            );

            filterApi.setItems(nextState);
        }

        // on drawer close, update the modal visibility state
        if (justClosed) {
            handleClose();
        }

        prevDrawer.current = drawer;
    }, [drawer, filterApi, filterItems, filterKeys, search, handleClose]);

    useEffect(() => {
        const nextState = getStateFromSearch(search, filterKeys, filterItems);

        filterApi.setItems(nextState);
    }, [filterApi, filterItems, filterKeys, search]);

    return {
        filterApi,
        filterItems,
        filterKeys,
        filterNames,
        filterFrontendInput,
        filterState,
        handleApply,
        handleClose,
        handleKeyDownActions,
        handleOpen,
        handleReset,
        isApplying,
        isOpen,
        customFilters,
        customFiltersData
    };
};
