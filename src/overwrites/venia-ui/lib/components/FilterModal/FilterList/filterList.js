import React, { Fragment, Suspense, useMemo } from 'react';
import { array, func, number, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import setValidator from '@magento/peregrine/lib/validators/set';
import { useFilterList } from '@magento/peregrine/lib/talons/FilterModal';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FilterItem from './filterItem';
import defaultClasses from './filterList.module.css';
import FilterItemRadioGroup from './filterItemRadioGroup';

const labels = new WeakMap();
const labels2 = new WeakMap();

const FilterOptionModal = React.lazy(() => import('@riosst100/pwa-marketplace/src/components/FilterOption/filterOptionModal'));

const FilterList = props => {
    const {
        filterApi,
        filterState,
        filterFrontendInput,
        name,
        group,
        itemCountToShow,
        items,
        onApply
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFilterList({ filterState, items, itemCountToShow });
    const { isListExpanded, handleListToggle, handleShowMore, activeFilter, setActiveFilter } = talonProps;
    const { formatMessage } = useIntl();

    let data = items.reduce((r, e) => {
        // get first letter of name of current element
        let grouping = e.title[0];
        // if there is no property in accumulator with this letter create it
        if(!r[grouping]) r[grouping] = {grouping, children: [e]}
        // if there is push current element to children array for that letter
        else r[grouping].children.push(e);
        // return accumulator
        return r;
    }, {})
    
    // since data at this point is an object, to get array of values
    // we use Object.values method
    let items2 = Object.values(data)

    items2 = items2.sort((a, b) => a.grouping.localeCompare(b.grouping));

    const groupingItemElements = useMemo(() => {
        return items2.map((data, index) => {
            const { grouping, children } = data;

            const elements1 = [];

            children.map((item, index) => {
                const { title, value } = item;

                const key = `item-${group}-${value}`;

                // create an element for each item
                elements1.push(
                    <li
                        key={key}
                        className={classes.popupFilterItem}
                        data-cy="FilterList-item"
                    >
                        <FilterItem
                            filterApi={filterApi}
                            filterState={filterState}
                            group={group}
                            item={item}
                            onApply={onApply}
                        />
                    </li>
                );

                // associate each element with its normalized title
                // titles are not unique, so use the element as the key
                // labels2.set(element1, title.toUpperCase());

                // return element2;
            });

            const element2 = <><ul><div><b>{grouping}</b></div>{elements1}</ul><br /></>;

            return element2;
        });
    }, [
        classes,
        filterApi,
        filterState,
        filterFrontendInput,
        name,
        group,
        items,
        isListExpanded,
        itemCountToShow,
        onApply
    ]);

    // memoize item creation
    // search value is not referenced, so this array is stable
    const itemElements = useMemo(() => {
        // if (filterFrontendInput === 'boolean') {
            const key = `item-${group}`;
            return (
                <li
                    key={key}
                    className={classes.item}
                    data-cy="FilterList-item"
                >
                    <FilterItemRadioGroup
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        name={name}
                        items={items}
                        onApply={onApply}
                        labels={labels}
                    />
                </li>
            );
        // }

        return items.map((item, index) => {
            const { title, value } = item;
            const key = `item-${group}-${value}`;

            if (!isListExpanded && index >= itemCountToShow) {
                return null;
            }

            // create an element for each item
            const element = (
                <li
                    key={key}
                    className={classes.item}
                    data-cy="FilterList-item"
                >
                    <FilterItem
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        item={item}
                        onApply={onApply}
                    />
                </li>
            );

            // associate each element with its normalized title
            // titles are not unique, so use the element as the key
            labels.set(element, title.toUpperCase());
            return element;
        });
    }, [
        classes,
        filterApi,
        filterState,
        filterFrontendInput,
        name,
        group,
        items,
        isListExpanded,
        itemCountToShow,
        onApply
    ]);

    const showMoreLessItem = useMemo(() => {
        if (items.length <= itemCountToShow) {
            return null;
        }

        const label = isListExpanded
            ? formatMessage({
                id: 'filterList.showLess',
                defaultMessage: 'Show Less'
            })
            : formatMessage({
                id: 'filterList.showAll',
                defaultMessage: 'Show All'
            });

        return (
            <li className={classes.showMoreLessItem}>
                <button
                    onClick={handleListToggle}
                    className={classes.showMoreLessButton}
                    data-cy="FilterList-showMoreLessButton"
                >
                    {label}
                </button>
            </li>
        );
    }, [
        isListExpanded,
        handleListToggle,
        items,
        itemCountToShow,
        formatMessage,
        classes
    ]);

    const showMoreItem = useMemo(() => {
        if (items.length <= itemCountToShow) {
            return null;
        }

        const label = formatMessage({
            id: 'filterList.viewAll',
            defaultMessage: 'View All'
        });

        return (
            <li className={classes.showMoreLessItem}>
                <button
                    onClick={handleShowMore}
                    className={classes.showMoreLessButton}
                    data-cy="FilterList-showMoreLessButton"
                >
                    {label}
                </button>
            </li>
        );
    }, [
        handleShowMore,
        items,
        itemCountToShow,
        formatMessage,
        classes
    ]);

    return (
        <Fragment>
            <ul className={classes.items}>
                {itemElements}
                {showMoreItem}
            </ul>
            <Suspense fallback={null}>
                {activeFilter && <FilterOptionModal groupingItemElements={groupingItemElements} setActiveFilter={setActiveFilter} />}
            </Suspense>
        </Fragment>
    );
};

FilterList.defaultProps = {
    onApply: null,
    itemCountToShow: 5
};

FilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    filterApi: shape({}),
    filterState: setValidator,
    name: string,
    group: string,
    items: array,
    onApply: func,
    itemCountToShow: number
};

export default FilterList;
