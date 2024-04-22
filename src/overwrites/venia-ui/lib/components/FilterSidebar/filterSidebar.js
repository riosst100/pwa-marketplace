import React, { useMemo, useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string, number } from 'prop-types';
import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import CurrentFilters from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/FilterModal/CurrentFilters';
import FilterBlock from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/FilterModal/filterBlock';
import defaultClasses from './filterSidebar.module.css';
import { Filter } from 'iconsax-react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';


const SCROLL_OFFSET = 150;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterSidebar = props => {
    const { filters, filterCountToOpen, allowedFilters, hideFilters } = props;
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

    const history = useHistory();

    const handleCategoryApplyFilter = useCallback(
        (...args) => {
            // const filterElement = filterRef.current;
            // if (
            //     filterElement &&
            //     typeof filterElement.getBoundingClientRect === 'function'
            // ) {
                // const filterTop = filterElement.getBoundingClientRect().top;
                // const windowScrollY =
                //     window.scrollY + filterTop - SCROLL_OFFSET;
                // window.scrollTo(0, windowScrollY);
            // }

            history.push('/'+args[1].path+'.html');

            if (args[0] != "category_uid") {
                handleApply(...args);
            }
        },
        [handleApply, filterRef]
    );

    const allowedFiltersArr = [];

    // allowedFilters && allowedFilters.length && allowedFilters.map((val, index) => {
    //     allowedFiltersArr.push(val.code);
    // });

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);
                const frontendInput = filterFrontendInput.get(group);

                const hideFilters = ['lof_preorder','auction','special_price'];
                if (!hideFilters.includes(group)) {
                // if (!allowedFilters && !allowedFiltersArr.length && group != "category_uid" || allowedFilters && allowedFiltersArr.length && allowedFiltersArr.includes(group)) {
                    

                    return (
                        <FilterBlock
                            key={group}
                            filterApi={filterApi}
                            filterState={blockState}
                            filterFrontendInput={frontendInput}
                            group={group}
                            items={items}
                            name={groupName}
                            onApply={group == "category_uid" ? handleCategoryApplyFilter : handleApplyFilter}
                            initialOpen={iteration < filterCountToOpen}
                        />
                    );
                }
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
                    id={'filterModal.action'}
                    defaultMessage={'Clear all'}
                />
            </LinkButton>
        </div>
    ) : null;

    return (
        <aside
            className={classes.root}
            ref={filterRef}
            data-cy="FilterSidebar-root"
            aria-busy="false"
        >
            <div className={classes.body}>
                <div className={cn(classes.header)}>
                    <h2
                        data-cy="FilterSidebar-headerTitle"
                        className={cn(classes.headerTitle, 'flex w-full justify-between items-center')}
                    >
                        <FormattedMessage
                            id={'filterModal.headerTitle'}
                            defaultMessage={'Filters'}
                        />
                        <Filter size={15} className='text-gray-900' />
                    </h2>
                </div>
                {hideFilters ? <ul className={classes.blocks}>No filters available.</ul> : <>
                <CurrentFilters
                    filterApi={filterApi}
                    filterNames={filterNames}
                    filterState={filterState}
                    onRemove={handleApplyFilter}
                />
                <ul className={classes.blocks}>{filtersList}</ul></>}
            </div>
        </aside>
    );
};

FilterSidebar.defaultProps = {
    filterCountToOpen: 3
};

FilterSidebar.propTypes = {
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

export default FilterSidebar;
