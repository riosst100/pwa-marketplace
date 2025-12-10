import React, { useCallback, useEffect, useMemo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useLocation, useHistory } from 'react-router-dom';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

import DEFAULT_OPERATIONS from './productContent.gql';

export const useProductContent = props => {
    const { sellerId, categoryId, data, pageSize = 6 } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getCategoryContentQuery,
        getProductFiltersByCategoryQuery,
        getCategoryAvailableSortMethodsQuery,
        getStoreConfigQuery
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

    // console.log('categoryData',categoryData)
    // console.log('categoryId',categoryId)

    const [, { dispatch }] = useEventingContext();

    useEffect(() => {
        if (categoryId) {
            getFilters({
                variables: {
                    categoryIdFilter: {
                        eq: categoryId
                    },
                    category_uid: categoryId
                }
            });
        }
    }, [categoryId, getFilters]);

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

    const rawFilters = filterData ? filterData.products.aggregations : null;
    const items = data ? data.items : placeholderItems;
    
    const category =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0]
            : null;
            // console.log('categorycategory',category)
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

    // console.log('category category',category)

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

    rawFilters && rawFilters.map((filter, index) => {

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

    const parent = null;
    const categoryDescription = null;

    const totalPagesFromData = data
        ? data.page_info.total_pages
        : null;
    const totalCount = data ? data.total_count : null;
    
    const categoryName =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].name
            : null;
    const availableSortMethods = sortData
        ? sortData.products.sort_fields.options
        : null;

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
        category,
        virtualCategoryFilters
    };
};
