import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { useSort } from '@magento/peregrine/lib/hooks/useSort';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

import DEFAULT_OPERATIONS from './sellerProducts.gql';

export const useSellerProducts = props => {
    const {
        sellerId,
        queries: { getPageSize }
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { resolveUrlQuery, getProductsQuery, getFilterInputsQuery, getCategoryDataQuery } = operations;

    const { data: pageSizeData } = useQuery(getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const sortProps = useSort({ sortFromSearch: false });
    const [currentSort] = sortProps;
    
    // const { pathname } = useLocation();

    // const pathnameArr = pathname.split('/');
    // const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');

    // return <><span>useSellerProducts</span></>;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [runResolveUrlQuery, queryResolveUrlResponse] = useLazyQuery(resolveUrlQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [runQuery, queryResponse] = useLazyQuery(getProductsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [runGetCategoriesQuery, queryGetCategoriesResponse] = useLazyQuery(getCategoryDataQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const {
        called: productCalled,
        loading: productLoading,
        error,
        data
    } = queryResponse;

    // console.log('===data===')
    // console.log(data)
    // console.log('======')

    const {
        called: routeCalled,
        loading: routeLoading,
        error: routeError,
        data: routeData
    } = queryResolveUrlResponse;

    const { search, pathname } = useLocation();

    const isBackgroundLoading = !!data && productLoading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const {
        called: introspectionCalled,
        data: introspectionData,
        loading: introspectionLoading
    } = useQuery(getFilterInputsQuery);

    // const {
    //     data: categoryData
    // } = useQuery(getCategoryDataQuery);
    // const { pathname } = useLocation();
    const slug = pathname.split('/').pop();
    // alert(slug)
    // const productUrlSuffix = storeConfigData?.storeConfig?.product_url_suffix;
    // const productUrlSuffix = '.html';
    // const categoryUrlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    useEffect(() => {
        // const filters = getFiltersFromSearch(search);

        

        // Construct the filter arg object.
        // const newFilters = {};
        // newFilters['url_key'] = { eq: categoryUrlKey };

        runResolveUrlQuery({
            variables: {
                // currentPage: Number(1),
                // filters: newFilters,
                // pageSize: Number(1)
                url: slug
            }
        });
    }, [
        runResolveUrlQuery,
        slug
    ]);

    const categoryId = useMemo(() => {
        let uid = null;
        if (routeData) {
            const { route } = routeData || {};
            uid = route?.uid;
        }
        return uid;
    }, [routeData]);

    

    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // console.log('=categoryData=')
        // console.log(categoryData)
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
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
        if (categoryId) {
            newFilters['category_uid'] = { eq: categoryId };
        }

        runQuery({
            variables: {
                currentPage: Number(currentPage),
                sellerId: sellerId,
                filter: newFilters,
                pageSize: Number(pageSize),
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
            }
        });
    }, [
        currentPage,
        currentSort,
        filterTypeMap,
        categoryId,
        pageSize,
        runQuery,
        search
    ]);

    const totalPagesFromData = data
        ? data.productsBySellerId.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !productLoading && !data && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, productLoading, setCurrentPage, data]);

    // Reset the current page back to one (1) when the search string, filters
    // or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !==
                currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !==
                currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1, true);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search, setCurrentPage]);

    const productData = productLoading && !data ? null : data;
    const categoryNotFound = false;

    // When only productLoading is involved, noProductsFound component flashes for a moment
    // const loading =
    //     (introspectionCalled && !categoryCalled) ||
    //     (productLoading && !data) ||
    //     introspectionLoading;

    const loading = false;

    useScrollTopOnChange(currentPage);

    return {
        error,
        productData,
        loading,
        categoryId,
        pageControl,
        sortProps,
        pageSize,
        categoryNotFound
    };
};
