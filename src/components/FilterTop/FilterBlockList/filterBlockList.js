import React, { Fragment, useMemo } from 'react';
import FilterTopItemGroup from './filterTopItemGroup';

const labels = new WeakMap();

const FilterBlockList = props => {
    const {
        filterApi,
        filterState,
        name,
        group,
        items,
        category,
        onApply,
        filterNames,
        originalFilterState,
        search,
        setFilterBy,
        customFiltersData,
        filterBy
    } = props;

    const itemElements = useMemo(() => {
        const key = `item-${group}`;
        return (
            <FilterTopItemGroup
                setFilterBy={setFilterBy}
                customFiltersData={customFiltersData}
                filterBy={filterBy}
                filterApi={filterApi}
                filterState={filterState}
                group={group}
                category={category}
                name={name}
                originalFilterState={originalFilterState}
                items={items}
                onApply={onApply}
                labels={labels}
                search={search}
                filterNames={filterNames}
                key={key}
            />
        );
    }, [
        filterApi,
        filterState,
        name,
        group,
        items,
        onApply
    ]);

    return (
        <Fragment>
            {itemElements}
        </Fragment>
    );
};

export default FilterBlockList;
