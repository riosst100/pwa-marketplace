import { useEffect, useMemo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useLocation } from 'react-router-dom';
import DEFAULT_OPERATIONS from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/RootComponents/Category/categoryContent.gql';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const useFilterContent = props => {
    const { searchQuery, activeFilter, active, setActive, currentSort, filterby, categoryId, data, pageSize = 6 } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getProductFiltersByCategoryQuery,
        getCategoryContentQuery,
        getFilterInputsQuery,
        getStoreConfigQuery,
        getMasterAttributesQuery
    } = operations;

    const placeholderItems = Array.from({ length: pageSize }).fill(null);

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [getFilters, { data: filtersDataResponse }] = useLazyQuery(
        getProductFiltersByCategoryQuery,
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
            if (!filterTypeMap.size) {
                return;
            }
    
            const filters = getFiltersFromSearch(search);
    
            // Construct the filter arg object.
            const newFilters = {};
            filters.forEach((values, key) => {
                if (masterAttributes.includes(key)) {
                    newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
                }
            });

            getFilters({
                variables: {
                    filters: newFilters
                }
            });
        }
    }, [categoryId, getFilters, filterTypeMap, search, masterAttributes]);

    const rawFilters = filtersDataResponse ? filtersDataResponse.products.aggregations : null;
    const items = data ? data.products.items : placeholderItems;
    const category =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0]
            : null;

    let filterData = [];
    let title = '';

    rawFilters && rawFilters.map((filter, index) => {

        if (filter.attribute_code == filterby) {
            let label = filter.label;

            const filterOptions = filter.options.filter(function({ count }) {
                return count > 0;
            })

            const newFilter = {
                attribute_code: filter.attribute_code,
                count: filter.count,
                label: label,
                position: filter.position,
                options: filterOptions
            };

            filterData = newFilter;
            title = label;
        }
    });

    const { value: sortby } = currentSort

    // const [runQuery, queryResponse] = useLazyQuery(getShopByDataQuery, {
    //     fetchPolicy: 'cache-and-network',
    //     nextFetchPolicy: 'cache-first'
    // });

    

    const pathnameArr = pathname.split('/');
    
    const categoryUrlKey = pathnameArr[pathnameArr.length - 1].replace('.html','');
    
    const categoryUrlSuffix = storeConfigData ? storeConfigData?.storeConfig?.category_url_suffix : '';
    // const categoryUrlSuffix = 'html';

    // const { data: introspectionData } = useQuery(getFilterInputsQuery);

    const activeFilters = [];

    const filters = getFiltersFromSearch(search);

    // Construct the filter arg object.
    const newFilters = {};
    filters.forEach((values, key) => {
        if (filterTypeMap.get(key)) {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
            
            if (key == "sc_baseball_release") {
                for(let item of values) {
                    if(item) {
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
        }
    });

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    const originalDataResult = useMemo(() => {
        if (!filterData) {
            return null;
        }
        
        const options = filterData?.options;
        if (!options) {
            return null;
        }

        const mappingData = options.reduce((acc, item) => {
            let firstLetter = item.label? item.label.charAt(0).toUpperCase() : '';
            if (!alpha.includes(firstLetter)) {
                firstLetter = '#';
            }
            if (filterby == "vehicles_year" || filterby == "trains_gauge" || filterby == "vehicles_scale" || filterby == "lego_theme" || filterby == "lego_subtheme" || filterby == "lego_interest") {
                firstLetter = '#';
            }
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(item);
            return acc;
        }, {});

        const sortbyData = [];

        return sortby != "all" ? sortbyData && sortbyData.length ? sortbyData.sort((a, b) => b.release_type.toLowerCase().localeCompare(a.release_type.toLowerCase())) : sortbyData : mappingData;
    }, [filterData, sortby]);

    const filteredOptions = useMemo(() => {
        if (!filterData) {
            return null;
        }
        
        const options = filterData?.options;
        if (!options) {
            return null;
        }

        if (searchQuery) {
            if (active != "all") {
                setActive('all');
            }

            return options.filter(function(option) {
                return option.label.search(new RegExp(searchQuery, "i")) != -1;
            });
        }

        return options;
    }, [filterData, searchQuery]);

    const dataResult = useMemo(() => {
        if (filteredOptions) {
            return filteredOptions.reduce((acc, item) => {
                let firstLetter = item.label ? item.label.charAt(0).toUpperCase() : '';
                if (!alpha.includes(firstLetter)) {
                    firstLetter = '#';
                }
                if (filterby == "vehicles_year" || filterby == "trains_gauge" || filterby == "vehicles_scale" || filterby == "lego_theme" || filterby == "lego_subtheme" || filterby == "lego_interest") {
                    firstLetter = '#';
                }
                acc[firstLetter] = acc[firstLetter] || [];
                acc[firstLetter].push(item);
                return acc;
            }, {});
        }

        return filteredOptions;
    }, [filteredOptions]);

    let availableGroups = originalDataResult ? Object.keys(originalDataResult).sort() : [];

    let filteredAvailableGroups = dataResult ? Object.keys(dataResult).sort() : [];
    

    console.log('dataResult', dataResult)
    if (filterby == "vehicles_year" || filterby == "trains_gauge" || filterby == "vehicles_scale" || filterby == "lego_theme" || filterby == "lego_subtheme" || filterby == "lego_interest") {
        availableGroups = ['#'];
        filteredAvailableGroups = ['#'];
    }

    const attributeData = filterData;

    return {
        filterData,
        title,
        dataResult,
        filteredAvailableGroups,
        categoryUrlSuffix,
        categoryUrlKey,
        availableGroups,
        alpha,
        category,
        activeFilters
    };
};
