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
        subFilterItems,
        filterState,
        handleApply,
        handleReset
    } = talonProps;

    // console.log(filters)
    // console.log('filterCountToOpen'+filterCountToOpen)
    // console.log('hideFilters'+hideFilters)

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
                // const windowScrollY =
                //     window.scrollY + filterTop - SCROLL_OFFSET;
                // window.scrollTo(0, windowScrollY);

                window.scrollTo(0, 0);
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

            history.push('/' + args[1].path + '.html');

            if (args[0] != "category_uid") {
                handleApply(...args);
            }
        },
        [handleApply, filterRef]
    );

    const allowedFiltersArr = [];

    allowedFilters?.length && allowedFilters.map((val, index) => {
        allowedFiltersArr.push(val.code);
    });

    // const ordering = ['card_artist','card_product_type', 'card_type'];
    // const sorted = new Map(
    //     [...filterItems.entries()].sort((a, b) => {
    //         const keyA = a[0];
    //         const keyB = b[0];

    //         const matchA = ordering.findIndex(o => keyA.endsWith(o));
    //         const matchB = ordering.findIndex(o => keyB.endsWith(o));

    //         const orderA = matchA === -1 ? Infinity : matchA;
    //         const orderB = matchB === -1 ? Infinity : matchB;

    //         // jika dua-duanya tidak match ordering → sort alphabetis
    //         if (orderA === Infinity && orderB === Infinity) {
    //             return keyA.localeCompare(keyB);
    //         }

    //         // urutkan sesuai ordering
    //         return orderA - orderB;
    //     })
    // );

    // // console.log([...sorted.entries()]);
    // const filterItems = [...sorted.entries()];

    // console.log('filterItems',filterItems)

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);
                const frontendInput = filterFrontendInput.get(group);

                const hideFilters = ['card_game','bricks_categories','sc_sports_categories','trains','trains_locomotives','trains_supplies_type','lof_preorder','auction','special_price','sc_baseball_inserts','sc_baseball_parallel','sale','sc_set_type','sc_brands'];
                if (!allowedFiltersArr?.length || filterState.size && allowedFiltersArr.length || !filterState.size && allowedFiltersArr.length && allowedFiltersArr.includes(group)) {
                    if (!hideFilters.includes(group) && groupName && !group.includes('card_release') && !group.includes('card_set') && !group.includes('sc_set_name')) {
                    
                    // if (!allowedFiltersArr?.length && group != "category_uid" || allowedFiltersArr?.length && allowedFiltersArr.includes(group)) {
                        let subFilter = null;
                        // if (group.includes('sc_release') || group.includes('card_release')) {
                        //     let subGroup = '';
                        //     if (group.includes('card_release')) {
                        //         subGroup = group.replace('card_release', 'card_set');
                        //     }

                        //     if (group.includes('sc_release')) {
                        //         subGroup = group.replace('sc_release', 'sc_set_name');
                        //     }

                        //     const subBlockState = filterState.get(subGroup);
                        //     const subFrontendInput = filterFrontendInput.get(subGroup);
                        //     const subFilterItems = filterItems.get(subGroup);

                        //     subFilter = {
                        //         key: subGroup,
                        //         filterApi: filterApi,
                        //         filterState: subBlockState,
                        //         filterFrontendInput: subFrontendInput,
                        //         group: subGroup,
                        //         isSubFilter: true,
                        //         items: subFilterItems,
                        //         name: '',
                        //         onApply: handleApplyFilter,
                        //         initialOpen: true
                        //     };

                        // }

                        return (
                            <FilterBlock
                                key={group}
                                filterApi={filterApi}
                                filterState={blockState}
                                allowedSubFilters={[]}
                                filterFrontendInput={frontendInput}
                                group={group}
                                subFilterItems={subFilterItems?.subFilters}
                                filterItems={filterItems}
                                subFilter={subFilter}
                                items={items}
                                name={groupName}
                                onApply={group == "category_uid" ? handleCategoryApplyFilter : handleApplyFilter}
                                initialOpen={true}
                            />
                        );
                    }
                }
            }),
        [
            filterApi,
            filterItems,
            filterNames,
            filterFrontendInput,
            filterState,
            subFilterItems,
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
