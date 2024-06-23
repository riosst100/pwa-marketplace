import React, { useMemo, useEffect } from 'react';
import FilterTopItem from './filterTopItem';
import { useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './filterTopItemGroup.module.css';
import CurrentTopFilter from '@riosst100/pwa-marketplace/src/components/FilterTop/CurrentTopFilters/currentTopFilter';

const FilterTopItemGroup = props => {
    const { filterApi, filterState, group, items, onApply, labels, filterNames, originalFilterState, search } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const currentGroup = group;
    const { removeItem } = filterApi;
    const activeFilters = [];

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
        return items.map(item => {
            const code = `item-${group}-${item.value}`;
            return (
                <FilterTopItem
                    key={code}
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
    }, [filterApi, filterState, group, items, labels, onApply]);

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

    return (
        <div className={classes.root}>
            {radioItems}
            {filterElements && filterElements.length > 10 ? <span className={classes.item}><b>More Item</b></span> : ''}
            {filterElements && filterElements.length ? filterElements : group != "shopby" ? (<span className={classes.item}><b>All</b></span>) : ''}
        </div>
    );
};

export default FilterTopItemGroup;
