import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useNonSportCardsSets } from '@riosst100/pwa-marketplace/src/talons/NonSportCardsSets/useNonSportCardsSets';
import { Link, useLocation } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './nonSportCardsSets.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { NonSportCardsSetsShimmer } from '@riosst100/pwa-marketplace/src/components/NonSportCardsSets';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';

const NonSportCardsSets = props => {
    const { categoryId } = props

    const { location } = globalThis;

    const query = new URLSearchParams(location.search);
    const activeParam = query.get('active_tab') || null;

    const [active, setActive] = useState('all');
    const [activeTab, setActiveTab] = useState(activeParam ? activeParam : 'leagues');
    const [activeBrand, setActiveBrand] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');

    let availableLeagues = [];
    let availableBrands = [];
    
    const shopby = query.get('shopby') || null;
    let setType = query.get('nsc_set_type[filter]') || null;
    const brandsFilter = query.get('sc_brands[filter]') || null;

    if (setType && setType.includes("Inserts")) {
        setType = "Inserts";
    }

    let defaultSort = {
        sortText: 'All (A-Z)',
        value: 'all'
    };
    
    if (shopby == "release_year") {
        defaultSort = {
            sortText: 'All (By Year)',
            value: 'date'
        };
    }
    
    const sortProps = useCustomSort({ sortFromSearch: false, defaultSort: defaultSort});

    const [currentSort] = sortProps;

    const [sortBy, setSortBy] = useState({
        sortText: 'All (A-Z)',
        value: 'all'
    });


    const classes = useStyle(defaultClasses);

    const talonProps = useNonSportCardsSets({ searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab });

    const { error, loading, nonSportCardsSets, categoryUrlSuffix, categoryUrlKey, productType, filteredNonSportCardsSets, availableGroups, category } = talonProps;

    if (loading && !nonSportCardsSets)
        return <NonSportCardsSetsShimmer />;
    if (error && !nonSportCardsSets) return <ErrorView />;

    if (!nonSportCardsSets && !loading && !error) {
        return <NonSportCardsSetsShimmer />;
    }

    const setsLengthArr = [];

    const newNonSportCardsSets = searchQuery ? filteredNonSportCardsSets : nonSportCardsSets;

    // useEffect(() => {
        if (newNonSportCardsSets && newNonSportCardsSets.length) {
            newNonSportCardsSets.map((setRelease, index) => {
                const { group, sets } = setRelease;

                setsLengthArr[group] = sets.length
            })
        }
    // }, [nonSportCardsSets])

    if (nonSportCardsSets && nonSportCardsSets.length) {
        nonSportCardsSets.map((setRelease, index) => {
            const { group, sets } = setRelease;
            // if (active == 'all' || active != "all" && active == group) {
                if (sets.length) {
                    sets.map((set, index) => {
                        if (set.sc_league) {
                            if (!availableLeagues.includes(set.sc_league)) {
                                availableLeagues.push(set.sc_league)
                            }
                        }
                    })
                }
            // }
        })
    }

    const splitToNChunks = (array, n) => {
        let result = [];
        for (let i = n; i > 0; i--) {
            result.push(array.splice(0, Math.ceil(array.length / i)));
        }
        return result;
    }

    let shopbyUrl = "release";

    const { search } = useLocation();

    let filterSearchArr = search ? search.split('&') : [];
    filterSearchArr = filterSearchArr.filter(function(data) {
        return !data.includes('shopby');
    })
    let filterSearch = filterSearchArr.join('&')

    if (!filterSearch.includes('?')) {
        filterSearch = '?'+filterSearch;
    }

    let additionalFilter = '';

    const setRelases = newNonSportCardsSets && newNonSportCardsSets.length && newNonSportCardsSets.map((setRelease, index) => {
        const { group, sets } = setRelease;

        const setsResult = [];

        if (sets.length) {
            sets.map((set, index) => {
                const { set_name, option_id, release_year } = set;

                // const categoryUrl = resourceUrl(
                //     `/${category?.url_path}${categoryUrlSuffix || ''}?sc_${category?.url_key}_${shopbyUrl}[filter]=${set_name},${option_id}`
                // );
                const filter = 'nsc_' + category?.url_key + '_' + shopbyUrl + '[filter]=' + set_name + ',' + option_id;
                const params = filterSearch ? filterSearch + '&' + filter + additionalFilter : '?' + filter + additionalFilter;

                const categoryUrl = resourceUrl(
                    `/${category.url_path}${categoryUrlSuffix || ''}${params}`
                );

                setsResult.push(<li className='list-none'>
                    <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2">
                        {set_name}
                    </Link>
                </li>)
            })
        }

        let setsResultSplitted = [];
        if (active == group || newNonSportCardsSets.length == 1) {
            setsResultSplitted = splitToNChunks(setsResult, 3);
        }
        
        return (
            <>
                {active == "all" && newNonSportCardsSets.length > 1 ?
                <div className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                    <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                        {group}
                    </div>
                    <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                </div> : ''}
                {active == group || newNonSportCardsSets.length == 1 ? setsResultSplitted && setsResultSplitted.length && setsResultSplitted.map((setsResult, index) =>
                    <div key={index} className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                        {index == 0 ? <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2'>{group}</div> : 
                        <div className='singles_item_group_letter text-xl font-medium pb-1 mb-2' style={{"marginTop":"35px"}}></div>}
                        <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                    </div>
                )
                 : ''}
            </>
        );
    });

    const handleActive = (val) => {
        setActive(val);

        setSearchQuery('')
    }

    const handleActiveTab = (val) => {
        setActiveTab(val);
        setSearchQuery('')
    }

    const handleActiveFilter = (val) => {
        setActiveFilter(val);

        setActive('all');

        setSearchQuery('')
    }

    const handleSearchQuery = (val) => {
        setSearchQuery(val)
        setActive('all')
    }

    let brandName = brandsFilter ? brandsFilter.split(',')[0] : '';

    let title = "By Release/Set";

    if (setType && setType == "Inserts") {
        title = "Insert Sets";
    }

    return (
        <Fragment>
            <StoreTitle>{title}</StoreTitle>
            <Breadcrumbs categoryId={categoryId} customPage={title} />
            {shopby != "release_year" && productType != "expansion_sets" && <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {title}
            </h1>}
            <ul className={classes.nav}>
                {availableGroups.map((group, index) => (
                <li key={index} className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActive(group)
                        }}
                    >
                        {active == group ? <b>{group}</b> : group}
                    </button>
                </li>
            ))}
            <li className={classes.nav_item}>
                <button
                    onClick={() => {
                        handleActive('all')
                    }}
                >
                    {active == 'all' ? <b>All</b> : 'All'}
                </button>
            </li>
            </ul>
            <div className='border border-gray-100 px-6'>
                {nonSportCardsSets ? (
                    <div
                        className={classes.toolbar}
                    >
                        <div style={{"width":"35%"}}><ArraySearchInput active={active} searchQuery={searchQuery} placeholder="Search sets..." isOpen={true} setSearchQuery={handleSearchQuery} /></div>
                        {/* <CustomSortBy sortProps={sortProps} availableSortMethods={availableSortBy} /> */}
                    </div>
                ) : ''}
                <Divider className="mb-5 px-4 mt-5" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {newNonSportCardsSets && newNonSportCardsSets.length ? setRelases : (searchQuery ? <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found for <b>{searchQuery}</b> search query.</div> : <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found.</div>)}
                    </div>
                </section>
            </div>
        </Fragment>
    );
    return '';
}

export default NonSportCardsSets;
