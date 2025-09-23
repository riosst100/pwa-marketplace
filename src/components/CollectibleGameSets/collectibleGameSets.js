import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useCollectibleGameSets } from '@riosst100/pwa-marketplace/src/talons/CollectibleGameSets/useCollectibleGameSets';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './collectibleGameSets.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { CollectibleGameSetsShimmer } from '@riosst100/pwa-marketplace/src/components/CollectibleGameSets';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';

const CollectibleGameSets = props => {
    const [active, setActive] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');

    const { location } = globalThis;

    const query = new URLSearchParams(location.search);
    const shopby = query.get('shopby') || null;

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
    
    const sortProps = useCustomSort({ sortFromSearch: false, defaultSort: defaultSort});

    const [currentSort] = sortProps;

    // const [sortBy, setSortBy] = useState({
    //     sortText: 'All (A-Z)',
    //     value: 'all'
    // });

    const classes = useStyle(defaultClasses);

    const talonProps = useCollectibleGameSets({ searchQuery, setActive, currentSort });

    const { error, loading, collectibleGameSets, categoryUrlSuffix, categoryUrlKey, productType, filteredCollectibleGameSets, availableGroups } = talonProps;

    if (loading && !collectibleGameSets)
        return <CollectibleGameSetsShimmer />;
    if (error && !collectibleGameSets) return <ErrorView />;

    if (!collectibleGameSets && !loading && !error) {
        return <CollectibleGameSetsShimmer />;
    }

    const setsLengthArr = [];

    const newCollectibleGameSets = searchQuery ? filteredCollectibleGameSets : collectibleGameSets;

    // useEffect(() => {
        if (collectibleGameSets) {
            collectibleGameSets.map((setRelease, index) => {
                const { release_type, sets } = setRelease;

                setsLengthArr[release_type] = sets.length
            })
        }
    // }, [collectibleGameSets])

    const setRelases = newCollectibleGameSets.map((setRelease, index) => {
        const { release_type, sets } = setRelease;

        const setsResult = [];

        if (sets.length) {
            sets.map((set, index) => {
                const { set_name, option_id, set_abbreviation, release_year } = set;

                const categoryUrl = resourceUrl(
                    `/games/collectible-game/${categoryUrlKey}${categoryUrlSuffix || ''}?card_set[filter]=${set_name},${option_id}`
                );

                setsResult.push(<li className='list-none'>
                    <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2">
                        {set_name} <small style={{"color":"grey"}}>{set_abbreviation}</small>
                    </Link>
                </li>)
            })
        }
        
        return (
            <>
                {active == "all" || active == release_type ?
                <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                    <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                        {release_type}
                    </div>
                    <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                </div> : ''}
            </>
        );
    });

    const handleActive = (val) => {
        setActive(val);

        // 


        setSearchQuery('')
    }

    let alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    let availableSortBy = [
        {
            'label': 'All (A-Z)',
            'value': 'all'
        },
        {
            'label': 'Latest Sets',
            'value': 'newest'
        }
    ];

    if (shopby == "release_year") {
        availableSortBy = [
            {
                'label': 'All (By Year)',
                'value': 'date'
            },
            {
                'label': 'Latest Sets',
                'value': 'newest'
            }
        ];

        // alpha = availableGroups;
    }

    if (productType == "expansion_sets") {
        // availableSortBy = [
        //     {
        //         'label': 'All (Expansion Sets)',
        //         'value': 'all'
        //     },
        //     {
        //         'label': 'Latest Sets',
        //         'value': 'newest'
        //     }
        // ];

        // alpha = availableGroups
    }

    let title = "All Sets";
    if (productType == "expansion_sets") {
        title = "Expansion Sets";
    } else if (productType == "artist") {
        title = "By Artist";
    } else if (shopby == "release_year") {
        title = "By Year";
    }

    return (
        <Fragment>
            <StoreTitle>{title}</StoreTitle>
            {shopby != "release_year" && productType != "expansion_sets" && <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {title}
            </h1>}
            {shopby == "release_year" || productType == "expansion_sets" && <ul className={classes.nav}>
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
            </ul>}
            <div className='border border-gray-100 px-6'>
                {collectibleGameSets ? (
                    <div
                        className={classes.toolbar}
                    >
                        <div style={{"width":"35%"}}><ArraySearchInput active={active} searchQuery={searchQuery} placeholder="Search sets..." isOpen={true} setSearchQuery={setSearchQuery} /></div>
                        <CustomSortBy sortProps={sortProps} availableSortMethods={availableSortBy} />
                    </div>
                ) : ''}
                <>
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
                </>
                <Divider className="mb-5 px-4 mt-5" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {newCollectibleGameSets && newCollectibleGameSets.length ? setRelases : (searchQuery ? <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found for <b>{searchQuery}</b> search query.</div> : <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found.</div>)}
                    </div>
                </section>
            </div>
        </Fragment>
    );
}

export default CollectibleGameSets;
