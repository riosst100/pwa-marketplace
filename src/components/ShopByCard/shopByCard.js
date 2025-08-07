import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useShopByCard } from '@riosst100/pwa-marketplace/src/talons/ShopByCard/useShopByCard';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './shopByCard.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { ShopByCardShimmer } from '@riosst100/pwa-marketplace/src/components/ShopByCard';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import { useLocation } from 'react-router-dom';

const ShopByCard = props => {
    const { categoryId } = props

    const { search } = useLocation();


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
    
    const sortProps = useCustomSort({ sortFromSearch: false, defaultSort: defaultSort});

    const [currentSort] = sortProps;

    // const [sortBy, setSortBy] = useState({
    //     sortText: 'All (A-Z)',
    //     value: 'all'
    // });

    const classes = useStyle(defaultClasses);

    const talonProps = useShopByCard({ searchQuery, setActive, currentSort, shopby });

    const { error, loading, shopByCard, categoryUrlSuffix, categoryUrlKey, productType, filteredShopByCard, availableGroups } = talonProps;

    if (loading && !shopByCard)
        return <ShopByCardShimmer />;
    if (error && !shopByCard) return <ErrorView />;

    if (!shopByCard && !loading && !error) {
        return <ShopByCardShimmer />;
    }

    const setsLengthArr = [];

    const newShopByCard = searchQuery ? filteredShopByCard : shopByCard;

    // useEffect(() => {
        if (shopByCard && shopByCard.length) {
            shopByCard.map((setRelease, index) => {
                const { release_type, sets } = setRelease;

                setsLengthArr[release_type] = sets.length
            })
        }
    // }, [shopByCard])

    const splitToNChunks = (array, n) => {
        let result = [];
        for (let i = n; i > 0; i--) {
            result.push(array.splice(0, Math.ceil(array.length / i)));
        }
        return result;
    }

    let newfilterSearchArr = search ? search.split('&') : [];
    newfilterSearchArr = newfilterSearchArr.filter(function(data) {
        return !data.includes('card_name%5Bfilter%5D') && !data.includes('shopby');
    });
    
    let filterSearch = newfilterSearchArr.join('&')

    if (!filterSearch.includes('?')) {
        filterSearch = '?'+filterSearch;
    }

    const setRelases = newShopByCard.length && newShopByCard.map((setRelease, index) => {
        const { release_type, sets } = setRelease;

        const setsResult = [];

        if (sets.length) {
            sets.map((set, index) => {
                const { set_name, option_id, set_abbreviation, release_year } = set;

                const categoryUrl = resourceUrl(
                    `/games/${categoryUrlKey}${categoryUrlSuffix || ''}${filterSearch || ''}&card_name[filter]=${set_name},${option_id}`
                );

                setsResult.push(<li className='list-none'>
                    <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2">
                        {set_name} <small style={{"color":"grey"}}>{set_abbreviation}</small>
                    </Link>
                </li>)
            })
        }

        let setsResultSplitted = [];
        if (active == release_type || newShopByCard.length == 1) {
            setsResultSplitted = splitToNChunks(setsResult, 3);
        }
        
        return (
            <>
                {active == "all" && newShopByCard.length > 1 ?
                <div className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                    <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                        {release_type}
                    </div>
                    <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                </div> : ''}
                {active == release_type || newShopByCard.length == 1 ? setsResultSplitted && setsResultSplitted.length && setsResultSplitted.map((setsResult, index) =>
                    <div key={index} className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                        {index == 0 ? <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2'>{release_type}</div> : 
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

    let title = "By Card Name";

    return (
        <Fragment>
            <StoreTitle>{title}</StoreTitle>
            <Breadcrumbs categoryId={categoryId} customPage={title} />
            {shopby != "release_year" && productType != "expansion_sets" && <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {title}
            </h1>}
            {shopby == "release_year" || productType == "expansion_sets" ? <ul className={classes.nav}>
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
            <div className='border border-gray-100 px-6'>
                {shopByCard ? (
                    <div
                        className={classes.toolbar}
                    >
                        <div style={{"width":"35%"}}><ArraySearchInput active={active} searchQuery={searchQuery} placeholder="Search sets..." isOpen={true} setSearchQuery={setSearchQuery} /></div>
                        <CustomSortBy sortProps={sortProps} availableSortMethods={availableSortBy} />
                    </div>
                ) : ''}
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
                <Divider className="mb-5 px-4 mt-5" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {newShopByCard && newShopByCard.length ? setRelases : (searchQuery ? <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No card found for <b>{searchQuery}</b> search query.</div> : <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No card found.</div>)}
                    </div>
                </section>
            </div>
        </Fragment>
    );
}

export default ShopByCard;
