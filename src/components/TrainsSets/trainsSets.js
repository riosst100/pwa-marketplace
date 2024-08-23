import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useTrainsSets } from '@riosst100/pwa-marketplace/src/talons/TrainsSets/useTrainsSets';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './trainsSets.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { TrainsSetsShimmer } from '@riosst100/pwa-marketplace/src/components/TrainsSets';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';

const TrainsSets = props => {
    const { categoryId } = props

    const { location } = globalThis;

    const query = new URLSearchParams(location.search);

    const [active, setActive] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [activeFilter, setActiveFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const shopby = query.get('shopby') || null;
    const setType = query.get('set_type') || null;

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

    // if (productType == "expansion_sets") {
    //     defaultSort = {
    //         sortText: 'All (Expansion Sets)',
    //         value: 'all'
    //     };
    // }
    
    // Sorting
    const sortProps = useCustomSort({ sortFromSearch: false, defaultSort: defaultSort});
    const [currentSort] = sortProps;
    // const [sortBy, setSortBy] = useState({
    //     sortText: 'All (A-Z)',
    //     value: 'all'
    // });

    // let availableSortBy = [
    //     {
    //         'label': 'All (A-Z)',
    //         'value': 'all'
    //     },
    //     {
    //         'label': 'By Year',
    //         'value': 'newest'
    //     }
    // ];

    const classes = useStyle(defaultClasses);

    const talonProps = useTrainsSets({ activeFilter, searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab });

    const { error, loading, trainsSets, categoryUrlSuffix, categoryUrlKey, productType, filteredTrainsSets, availableGroups, category } = talonProps;

    if (loading && !trainsSets)
        return <TrainsSetsShimmer />;
    if (error && !trainsSets) return <ErrorView />;

    if (!trainsSets && !loading && !error) {
        return <TrainsSetsShimmer />;
    }

    const setsLengthArr = [];

    const newTrainsSets = searchQuery || activeFilter ? filteredTrainsSets : trainsSets;

    // useEffect(() => {
        if (newTrainsSets && newTrainsSets.length) {
            newTrainsSets.map((setRelease, index) => {
                const { group, sets } = setRelease;

                setsLengthArr[group] = sets.length
            })
        }
    // }, [trainsSets])

    const splitToNChunks = (array, n) => {
        let result = [];
        for (let i = n; i > 0; i--) {
            result.push(array.splice(0, Math.ceil(array.length / i)));
        }
        return result;
    }

    const setRelases = newTrainsSets && newTrainsSets.length && newTrainsSets.map((setRelease, index) => {
        const { group, sets } = setRelease;

        const setsResult = [];

        if (sets.length) {
            sets.map((set, index) => {
                const { set_name, option_id } = set;

                const categoryUrl = resourceUrl(
                    `/${category?.url_path}${categoryUrlSuffix || ''}?${shopby}[filter]=${set_name},${option_id}`
                );

                setsResult.push(<li className='list-none'>
                    <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2">
                        {set_name}
                    </Link>
                </li>)
            })
        }

        let setsResultSplitted = [];
        if (active == group || newTrainsSets.length == 1) {
            setsResultSplitted = splitToNChunks(setsResult, 3);
        }
        
        return (
            <>
                {active == "all" && newTrainsSets.length > 1 ?
                <div className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                    <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                        {group}
                    </div>
                    <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                </div> : ''}
                {active == group || newTrainsSets.length == 1 ? setsResultSplitted && setsResultSplitted.length && setsResultSplitted.map((setsResult, index) =>
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
        setActive('all');
        setActiveFilter('');

        setSearchQuery('')
    }
    const handleSearchQuery = (val) => {
        setSearchQuery(val)
        setActive('all')
    }

    let alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    let title = "";
    if (shopby == "trains_roadname") {
        title = "Roadname";
    }

    if (shopby == "trains_brands") {
        title = "Brands";
    }

    let availableFilters = [];

    if (activeTab == "country") {
        availableFilters = [
            'USA',
            'Canada',
            'UK',
            'Europe',
            'Asia',
            'Australia'
        ];
    }

    if (activeTab == "trains_gauge") {
        availableFilters = [
            'N Scale',
            'HO Scale',
            'O Scale',
            'G Scale',
            'S Scale',
            'Z Scale'
        ];
    }

    const handleActiveFilter = (val) => {
        setActiveFilter(val);

        setActive('all');

        setSearchQuery('')
    }

    return (
        <Fragment>
            <StoreTitle>{title}</StoreTitle>
            <Breadcrumbs categoryId={categoryId} customPage={title} />
            <ul className={classes.nav}>
                {shopby == "trains_roadname" &&
                    <li className={classes.nav_item}>
                        <button
                            onClick={() => {
                                handleActiveTab('country')
                            }}
                        >
                            {activeTab == 'country' ? <b>By Country</b> : 'By Country'}
                        </button>
                    </li>
                }
                {shopby == "trains_brands" &&
                    <li className={classes.nav_item}>
                        <button
                            onClick={() => {
                                handleActiveTab('trains_gauge')
                            }}
                        >
                            {activeTab == 'trains_gauge' ? <b>By Gauge</b> : 'By Gauge'}
                        </button>
                    </li>
                }
                {/* <li className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActiveTab('all')
                        }}
                    >
                        {activeTab == "all" ? <b>All</b> : 'All'}
                    </button>
                </li> */}
            </ul>
            {activeTab != "all" ? <><ul className={classes.nav}>
                {availableFilters.map((group, index) => (
                <li key={index} className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActiveFilter(group)
                        }}
                    >
                        {activeFilter == group ? <b>{group}</b> : group}
                    </button>
                </li>
                ))}
                <li className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActiveFilter('')
                        }}
                    >
                        {!activeFilter ? <b>All</b> : 'All'}
                    </button>
                </li>
                </ul>
            </> : ''}
            <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {title}
            </h1>
            <div className='border border-gray-100 px-6'>
                {trainsSets ? (
                    <div
                        className={classes.toolbar}
                    >
                        <div style={{"width":"35%"}}><ArraySearchInput active={active} searchQuery={searchQuery} placeholder="Search sets..." isOpen={true} setSearchQuery={handleSearchQuery} /></div>
                        {/* <CustomSortBy sortProps={sortProps} availableSortMethods={availableSortBy} /> */}
                    </div>
                ) : ''}
                <section className='single_list-indexing-container relative m-auto pt-5'>
                    {<ul className='flex gap-2 justify-center flex-wrap'>
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
                    </ul>}
                </section>
                <Divider className="mb-5 px-4 mt-5" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {newTrainsSets && newTrainsSets.length ? setRelases : (searchQuery ? <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found for <b>{searchQuery}</b> search query.</div> : <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found.</div>)}
                    </div>
                </section>
            </div>
        </Fragment>
    );
}

export default TrainsSets;
