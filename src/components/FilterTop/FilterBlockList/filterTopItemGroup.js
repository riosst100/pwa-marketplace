import React, { useMemo, useEffect } from 'react';
import FilterTopItem from './filterTopItem';
import { useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './filterTopItemGroup.module.css';
import CurrentTopFilter from '@riosst100/pwa-marketplace/src/components/FilterTop/CurrentTopFilters/currentTopFilter';
import { useLocation } from 'react-router-dom';

const FilterTopItemGroup = props => {
    const { customFiltersData, setFilterBy, filterBy, filterApi, filterState, group, items, onApply, labels, filterNames, originalFilterState, search } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const currentGroup = group;
    const { removeItem } = filterApi;
    const activeFilters = [];

    const location = useLocation();
    const { pathname } = location

    // Current Filters
    const filterElements = useMemo(() => {
        const elements = [];
        for (const [group, items] of originalFilterState) {
            for (const item of items) {
                const { title, value } = item || {};
                const key = `${group}::${title}_${value}`;

                if (group === currentGroup) {
                    activeFilters.push(item.value)
                    elements.push(
                        <CurrentTopFilter
                            group={group}
                            item={item}
                            removeItem={removeItem}
                            onRemove={onApply}
                        />
                    );
                }
            }
        }

        return elements;
    }, [originalFilterState, removeItem, onApply]);

    const radioItems = useMemo(() => {
        let selected = items.find(item => pathname.includes(item.value));
        if (!selected) {
            selected = items[0];
        }

        const selectedOption = selected ? selected.value : null;

        return items.map(item => {
            const code = `item-${group}-${item.value}`;
            return (
                <FilterTopItem
                    key={code}
                    selectedOption={selectedOption}
                    setFilterBy={setFilterBy}
                    filterBy={filterBy}
                    filterApi={filterApi}
                    filterState={filterState}
                    group={group}
                    activeFilters={activeFilters}
                    search={search}
                    item={item}
                    onApply={onApply}
                    labels={labels}
                />
            );
        });
    }, [pathname, filterApi, filterState, group, items, labels, onApply]);

    const fieldValue = useMemo(() => {
        if (filterState) {
            for (const item of items) {
                if (filterState.has(item)) {
                    return item.value;
                }
            }
        }

        return null;
    }, [filterState, items]);
    const field = `item-${group}`;
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    useEffect(() => {
        if (field && fieldValue === null) {
            fieldApi.reset();
        } else if (field && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [field, fieldApi, fieldState.value, fieldValue]);

    // console.log(customFiltersData.filters)
                    

    const customFilterData = useMemo(() => {
        const filterNull = customFiltersData.filters.filter(item => item !== null);
        // console.log('customFiltersData',customFiltersData)
        const filtered = filterNull.filter(item => item.attribute_code === group);
        // console.log('filtered ' + group,filtered);
        if (filtered) {
            // console.log('filtered ' + group,filtered);
            // console.log('show_all_btn 2 ' + group,isShowAllBtn);
            return filtered[0];
        }

        return null;
    }, [customFiltersData]);

    return (
        <div className={classes.root}>
            {radioItems}
            {filterElements && filterElements.length > 10 ? <span className={classes.item}><b>More Item</b></span> : ''}

            {customFilterData && customFilterData.show_all_btn ? <span className={classes.item}><b>All</b></span> : ''}

            {/* {filterElements && filterElements.length ? filterElements : group && group != "character" && group != "product_series" && group != "scale" && group != "product_line" && group != "trains" && group != "franchise" && group != "brands" && group != "bricks_categories" && group != "category" && group != "sc_sports_categories" && group != "card_game" && group != "filterby" && group != "shopby" && group != "cat_id" ? (<span className={classes.item}><b>All</b></span>) : ''} */}
        </div>
    );
};

export default FilterTopItemGroup;
