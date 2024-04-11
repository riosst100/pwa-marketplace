import React, { useMemo, useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string, number } from 'prop-types';
import { useFilterTop } from '@riosst100/pwa-marketplace/src/talons/FilterTop';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import FilterTopBlock from './filterTopBlock';
import defaultClasses from './filterTop.module.css';
import { Filter } from 'iconsax-react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';


const SCROLL_OFFSET = 150;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterTop = props => {
    const { filters, filterCountToOpen, allowedFilters } = props;
    const talonProps = useFilterTop({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterFrontendInput,
        filterState,
        handleApply,
        handleReset,
        customFilters
    } = talonProps;

    const filterRef = useRef();

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

    // const allowedFiltersArr = [];

    // allowedFilters.length && allowedFilters.map((val, index) => {
    //     allowedFiltersArr.push(val.code);
    // });
    // const allowedFiltersArr = ['card_rarity','card_print_version','card_set', 'card_product_type'];

    console.log(customFilters)

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);
                const frontendInput = filterFrontendInput.get(group);
                if (customFilters && customFilters.length && customFilters.includes(group)) {

                    return (
                        <FilterTopBlock
                            key={group}
                            filterNames={filterNames}
                            filterApi={filterApi}
                            filterState={blockState}
                            originalFilterState={filterState}
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
            customFilters,
            handleApplyFilter
        ]
    );

    return (
        <div>{filtersList}</div>
    );
};

export default FilterTop;
