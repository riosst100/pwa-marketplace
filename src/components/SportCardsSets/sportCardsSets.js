import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useSportCardsSets } from '@riosst100/pwa-marketplace/src/talons/SportCardsSets/useSportCardsSets';
import { Link, useLocation } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './sportCardsSets.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { SportCardsSetsShimmer } from '@riosst100/pwa-marketplace/src/components/SportCardsSets';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';

const SportCardsSets = props => {
    const { categoryId } = props

    const { location } = globalThis;

    const query = new URLSearchParams(location.search);
    const activeParam = query.get('active_tab') || null;

    const [active, setActive] = useState('all');
    const [activeTab, setActiveTab] = useState(activeParam ? activeParam : 'leagues');
    const [activeFilter, setActiveFilter] = useState('Major Baseball League');
    const [activeBrand, setActiveBrand] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');

    let availableLeagues = [];
    let availableBrands = [];
    
    const shopby = query.get('shopby') || null;
    const setType = query.get('set_type') || null;
    const brandsFilter = query.get('sc_brands[filter]') || null;

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

    const talonProps = useSportCardsSets({ searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab, activeFilter });

    const { error, loading, sportCardsSets, categoryUrlSuffix, categoryUrlKey, productType, filteredSportCardsSets, availableGroups, category } = talonProps;

    if (loading && !sportCardsSets)
        return <SportCardsSetsShimmer />;
    if (error && !sportCardsSets) return <ErrorView />;

    if (!sportCardsSets && !loading && !error) {
        return <SportCardsSetsShimmer />;
    }

    const setsLengthArr = [];

    const newSportCardsSets = searchQuery || activeFilter != "all" ? filteredSportCardsSets : sportCardsSets;

    // useEffect(() => {
        if (newSportCardsSets && newSportCardsSets.length) {
            newSportCardsSets.map((setRelease, index) => {
                const { group, sets } = setRelease;

                setsLengthArr[group] = sets.length
            })
        }
    // }, [sportCardsSets])

    if (sportCardsSets && sportCardsSets.length) {
        sportCardsSets.map((setRelease, index) => {
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
    if (shopby == "sc_baseball_players") {
        shopbyUrl = "players";
    }

    if (shopby == "sc_baseball_teams") {
        shopbyUrl = "teams";
    }

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

    const setRelases = newSportCardsSets && newSportCardsSets.length && newSportCardsSets.map((setRelease, index) => {
        const { group, sets } = setRelease;

        const setsResult = [];

        if (sets.length) {
            sets.map((set, index) => {
                const { set_name, option_id, release_year } = set;

                // const categoryUrl = resourceUrl(
                //     `/${category?.url_path}${categoryUrlSuffix || ''}?sc_${category?.url_key}_${shopbyUrl}[filter]=${set_name},${option_id}`
                // );
                const filter = 'sc_' + category?.url_key + '_' + shopbyUrl + '[filter]=' + set_name + ',' + option_id;
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
        if (active == group || newSportCardsSets.length == 1) {
            setsResultSplitted = splitToNChunks(setsResult, 3);
        }
        
        return (
            <>
                {active == "all" && newSportCardsSets.length > 1 ?
                <div className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                    <div className='singles_item_group_letter text-xl font-semibold border-b border-gray-100 pb-1 mb-2' >
                        {group}
                    </div>
                    <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                </div> : ''}
                {active == group || newSportCardsSets.length == 1 ? setsResultSplitted && setsResultSplitted.length && setsResultSplitted.map((setsResult, index) =>
                    <div key={index} className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                        {index == 0 ? <div className='singles_item_group_letter text-xl font-semibold border-b border-gray-100 pb-1 mb-2'>{group}</div> : 
                        <div className='singles_item_group_letter text-xl font-semibold pb-1 mb-2' style={{"marginTop":"35px"}}></div>}
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

    let alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    
    let brandName = brandsFilter ? brandsFilter.split(',')[0] : '';

    let title = "By Release/Set";
    if (shopby == "sc_baseball_players") {
        title = "Player"
    } else if (shopby == "sc_baseball_teams") {
        title = "Team";
    } else {
        if (activeTab == "year") {
            title = "By Year";
        } else if (activeTab == "leagues") {
            title = "By Leagues";
        } else if (activeTab == "brand") {
            title = brandName;
        }
    }

    return (
        <Fragment>
            <StoreTitle>{title}</StoreTitle>
            <Breadcrumbs categoryId={categoryId} customPage={title} />
            {shopby == "release" ? <ul className={classes.nav}>
                <li className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActiveTab('year')
                        }}
                    >
                        {activeTab == 'year' ? <b>By Year</b> : 'By Year'}
                    </button>
                </li>
                <li className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActiveTab('leagues')
                        }}
                    >
                        {activeTab == 'leagues' ? <b>By Leagues</b> : 'By Leagues'}
                    </button>
                </li>
            </ul> : ''}
            {shopby == "sc_baseball_players" || shopby == "sc_baseball_teams" ? availableLeagues ? <ul className={classes.nav}>
                {availableLeagues.map((group, index) => (
                <li key={index} className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActiveFilter(group)
                        }}
                    >
                        {activeFilter == group ? <b>{group}</b> : group}
                    </button>
                </li>
            ))}</ul> : '' : ''}
            {shopby != "release_year" && productType != "expansion_sets" && <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {title}
            </h1>}
            {shopby == "release" ? <ul className={classes.nav}>
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
            </ul> : ''}
            {shopby == "release" && activeTab == "leagues" && availableLeagues ? <ul className={classes.nav}>
                {availableLeagues.map((group, index) => (
                <li key={index} className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActiveFilter(group)
                        }}
                    >
                        {activeFilter == group ? <b>{group}</b> : group}
                    </button>
                </li>
            ))}</ul> : ''}
            <div className='border border-gray-100 px-6'>
                {sportCardsSets ? (
                    <div
                        className={classes.toolbar}
                    >
                        <div style={{"width":"35%"}}><ArraySearchInput active={active} searchQuery={searchQuery} placeholder="Search sets..." isOpen={true} setSearchQuery={handleSearchQuery} /></div>
                        {/* <CustomSortBy sortProps={sortProps} availableSortMethods={availableSortBy} /> */}
                    </div>
                ) : ''}
                {shopby == "sc_baseball_players" || shopby == "sc_baseball_teams" || shopby == "sets" ? <>
                    <section className='single_list-indexing-container relative m-auto pt-5'>
                        <ul className='flex gap-2 justify-center flex-wrap'>
                            <li>
                                <button
                                    className={cn(
                                        'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                        'leading-4 font-medium text-base hover_bg-gray-50'
                                    )}
                                    onClick={() => {
                                        handleActive('all')
                                    }}
                                >
                                    {active == 'all' ? <b>All</b> : 'All'}
                                </button>
                            </li>
                            {alpha.map((letter, index) => (
                                <li key={index}>
                                    <button
                                        className={cn(
                                            'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                            'leading-4 font-medium text-base ',
                                            setsLengthArr[letter] > 0 ? 'hover_bg-gray-50' : 'bg-gray-100 text-gray-400',
                                        )}
                                        onClick={() => {
                                            handleActive(letter)
                                        }}
                                        disabled={setsLengthArr[letter] > 0 ? false : true}
                                    >
                                        {active == letter ? <b>{letter}</b> : letter}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </> : ''}
                <Divider className="mb-5 px-4 mt-5" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {newSportCardsSets && newSportCardsSets.length ? setRelases : (searchQuery ? <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found for <b>{searchQuery}</b> search query.</div> : <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found.</div>)}
                    </div>
                </section>
            </div>
        </Fragment>
    );
    return '';
}

export default SportCardsSets;
