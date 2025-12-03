import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useLocation, useHistory } from 'react-router-dom';
import DEFAULT_OPERATIONS from './categoryContent.gql';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

/**
 * Returns props necessary to render the categoryContent component.
 *
 * @param {object} props.data - The results of a getCategory GraphQL query.
 *
 * @returns {object} result
 * @returns {string} result.categoryDescription - This category's description.
 * @returns {string} result.categoryName - This category's name.
 * @returns {object} result.filters - The filters object.
 * @returns {object} result.items - The items in this category.
 * @returns {number} result.totalPagesFromData - The total amount of pages for the query.
 */
export const useCategoryContent = props => {
    const { categoryId, data, pageSize = 6 } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getCategoryContentQuery,
        getProductFiltersByCategoryQuery,
        getCategoryAvailableSortMethodsQuery,
        getStoreConfigQuery,
        getFilterInputsQuery,
        getMasterAttributesQuery
    } = operations;

    const placeholderItems = Array.from({ length: pageSize }).fill(null);
    
    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const virtualCategoryFilters = useMemo(() => {
        if (storeConfigData) {
            const data = storeConfigData.storeConfig.custommarketplace_plp_filters_virtualcategory;
            return data ? data.split(',') : [];
        }
    }, [storeConfigData]);

    const [getFilters, { data: filterData }] = useLazyQuery(
        getProductFiltersByCategoryQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [getSortMethods, { data: sortData }] = useLazyQuery(
        getCategoryAvailableSortMethodsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

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

    const [, { dispatch }] = useEventingContext();
    const { search } = useLocation();

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

    // MASTER ATTRIBUTES
    const {
        called: masterAttributesCalled,
        data: masterAttributesData,
        loading: masterAttributesLoading
    } = useQuery(getMasterAttributesQuery,
    {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const masterAttributes = useMemo(() => {
        const masterAttributes = [];
        
        if (masterAttributesData) {
            masterAttributesData.masterAttributes.forEach(({ attribute_code }) => {
                masterAttributes.push(attribute_code);
            });
        }

        return masterAttributes;
    }, [masterAttributesData]);
    
    

    useEffect(() => {
        if (categoryId) {

            // categoryIdFilter: {
            //     eq: categoryId
            // }
            if (!filterTypeMap.size) {
                return;
            }
    
            const filters = getFiltersFromSearch(search);

            // console.log('masterAttributes',masterAttributes)
            // console.log('filters',filters)

    
            // Construct the filter arg object.
            const newFilters = {};
            filters.forEach((values, key) => {
                // if (masterAttributes.includes(key)) {
                    newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
                // }
            });

            // console.log('newFilters',newFilters)

            getFilters({
                variables: {
                    filters: newFilters,
                    category_uid: categoryId
                }
            });
        }
    }, [categoryId, getFilters, filterTypeMap, search, masterAttributes]);

    useEffect(() => {
        if (categoryId) {
            getSortMethods({
                variables: {
                    categoryIdFilter: {
                        in: categoryId
                    }
                }
            });
        }
    }, [categoryId, getSortMethods]);

    // console.log('filterData')
    // console.log(filterData)

    const rawFilters = filterData ? filterData.products.aggregations : null;
    const items = data ? data.products.items : placeholderItems;
    const category =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0]
            : null;
    const children =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].children
            : null;

    const filters = [];

    const history = useHistory();
    const location = useLocation();

    const setQueryParam = ({ history, location, parameter, replace, value }) => {
        const { search } = location;
        const queryParams = new URLSearchParams(search);

        queryParams.set(parameter, value);
        const destination = { search: queryParams.toString() };

        if (replace) {
            history.replace(destination);
        } else {
            history.push(destination);
        }
    };

    const setDefaultSubcategoryAndTopFilter = useCallback(
        (value, searchParam, replace = false) => {
            // Update the query parameter.
            setQueryParam({
                history,
                location,
                parameter: searchParam,
                replace,
                value: value
            });
        },
        [history, location]
    );

    useEffect(() => {
        const { search } = location;

        if (category && category.default_top_filter) {
            const defaultTopFilter = category.default_top_filter;

            const attrCode = defaultTopFilter.attribute_code;
            const label = defaultTopFilter.label;
            const value = defaultTopFilter.value;

            if (!search.includes(attrCode)) {
                setDefaultSubcategoryAndTopFilter(
                    label + ',' + value, 
                    attrCode + '[filter]', 
                    true
                );
            }
        }
    }, [category, location, setDefaultSubcategoryAndTopFilter]);

    // console.log('rawFilters')
    // console.log(rawFilters)

    rawFilters && rawFilters.map((filter, index) => {

    //     console.log('filter')
    // console.log(filter)

        const filterOptions = [];
        let label = filter.label;
        if (filter.attribute_code == "category_uid") {
            children && children.map((category, index) => {
                filterOptions.push({
                    'label': category.name,
                    'value': category.uid,
                    'path': category.url_path
                });
            });

            label = category ? category.name : label;
        }

        const newFilter = {
            attribute_code: filter.attribute_code,
            count: filter.count,
            label: label,
            position: filter.position,
            options: filterOptions.length ? filterOptions : filter.options
        };

        filters.push(newFilter);
    });

    const attributesBlock = categoryData && categoryData.categories.items.length
    ? categoryData.categories.items[0].attributes_block
    : null;
    const parent =
    categoryData && categoryData.categories.items.length
        ? categoryData.categories.items[0].parent
        : null;
    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;
    const totalCount = data ? data.products.total_count : null;
    
    const categoryName =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].name
            : null;
    const categoryDescription =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].description
            : null;
    const availableSortMethods = sortData
        ? sortData.products.sort_fields.options
        : null;

    useEffect(() => {
        if (!categoryLoading && categoryData.categories.items.length > 0) {
            dispatch({
                type: 'CATEGORY_PAGE_VIEW',
                payload: {
                    id: categoryData.categories.items[0].uid,
                    name: categoryData.categories.items[0].name,
                    url_key: categoryData.categories.items[0].url_key,
                    url_path: categoryData.categories.items[0].url_path
                }
            });
        }
    }, [categoryData, dispatch, categoryLoading]);

    return {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData,
        children,
        parent,
        attributesBlock,
        category,
        virtualCategoryFilters
    };
};
