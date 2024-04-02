import React, { useMemo, useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string, number } from 'prop-types';
import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import CustomFilters from './CustomFilters';
import FilterBlock from '@magento/venia-ui/lib/components/FilterModal/filterBlock';
import defaultClasses from './filterTop.module.css';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { Link } from 'react-router-dom';
import CurrentFilters from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/FilterModal/CurrentFilters';

const SCROLL_OFFSET = 150;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterTop = props => {
    const { filters, filterCountToOpen, category } = props;
    const talonProps = useFilterSidebar({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterFrontendInput,
        filterState,
        handleApply,
        handleReset
    } = talonProps;

    const filterRef = useRef();
    const classes = useStyle(defaultClasses, props.classes);

    const handleApplyFilter = useCallback(
        (...args) => {
            const filterElement = filterRef.current;
            if (
                filterElement &&
                typeof filterElement.getBoundingClientRect === 'function'
            ) {
                const filterTop = filterElement.getBoundingClientRect().top;
                const windowScrollY =
                    window.scrollY + filterTop - SCROLL_OFFSET;
                window.scrollTo(0, windowScrollY);
            }

            handleApply(...args);
        },
        [handleApply, filterRef]
    );

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);
                const frontendInput = filterFrontendInput.get(group);
                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        filterFrontendInput={frontendInput}
                        group={group}
                        items={items}
                        name={groupName}
                        onApply={handleApplyFilter}
                        initialOpen={iteration < filterCountToOpen}
                    />
                );
            }),
        [
            filterApi,
            filterItems,
            filterNames,
            filterFrontendInput,
            filterState,
            filterCountToOpen,
            handleApplyFilter
        ]
    );

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <LinkButton
                type="button"
                onClick={handleReset}
                data-cy="FilterSidebar-clearButton"
            >
                <FormattedMessage
                    id={'filterModal.all'}
                    defaultMessage={'All'}
                />
            </LinkButton>
        </div>
    ) : null;

    return (
        <CustomFilters
            filterApi={filterApi}
            filterNames={filterNames}
            filterState={filterState}
            clearAll={clearAll}
            category={category}
            onRemove={handleApplyFilter}
        />
    );
};

FilterTop.defaultProps = {
    filterCountToOpen: 3
};

FilterTop.propTypes = {
    classes: shape({
        action: string,
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            attribute_code: string,
            items: array
        })
    ),
    filterCountToOpen: number
};

export default FilterTop;
