import React, { useMemo, useCallback, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string, number } from 'prop-types';
import { useFilterTop } from '@riosst100/pwa-marketplace/src/talons/FilterTop';
import { useLocation } from 'react-router-dom';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import FilterTopBlock from './filterTopBlock';
import defaultClasses from './filterTop.module.css';
import { Filter } from 'iconsax-react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';


const SCROLL_OFFSET = 150;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterTop = props => {
    const { shopby, filters, filterCountToOpen, allowedFilters, category } = props;
    const [filterBy, setFilterBy] = useState('');
    
    const talonProps = useFilterTop({ shopby, filters, category, filterBy, setFilterBy });
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

    const classes = useStyle(defaultClasses, props.classes);

    const [activeSportCardsSetsFilter, setActiveSportCardsSetsFilter] = useState('all');
    const [activeBaseSetFilter, setActiveBaseSetFilter] = useState('all');

    const { search } = useLocation();

    // const filtersSearch = getFiltersFromSearch(search);

    // filters.forEach((values, key) => {
    //     newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
    // });

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
                            setFilterBy={setFilterBy}
                            filterBy={filterBy}
                            filterNames={filterNames}
                            filterApi={filterApi}
                            filterState={blockState}
                            originalFilterState={filterState}
                            filterFrontendInput={frontendInput}
                            group={group}
                            search={search}
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
        <div>
            {/* <div className={classes.root}>
            {sportCardsSetsFilter.map(({label, value}, index) => 
                activeSportCardsSetsFilter == value ? <span className={classes.item}><b>{label}</b></span> : <span onClick={() => setActiveSportCardsSetsFilter(value)} className={classes.item}>{label}</span>
            )}
            </div>
            <div className={classes.root}>
            {activeSportCardsSetsFilter == "base_set" && baseSetFilter.map(({label, value}, index) => 
                activeBaseSetFilter == value ? <span className={classes.item}><b>{label}</b></span> : <span onClick={() => setActiveBaseSetFilter(value)} className={classes.item}>{label}</span>
            )}
            </div> */}
            {filtersList}
            {/* {activeSportCardsSetsFilter == "inserts_parallel" && (
                <>
                    <div className={classes.root}>
                        <Link to={'?shopby=inserts'} className={classes.item}>Inserts</Link>
                        <Link to={'?shopby=parallel'} className={classes.item}>Parallel</Link>
                    </div>
                </>
            )} */}
        </div>
    );
};

export default FilterTop;
