import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useSetsData } from '@riosst100/pwa-marketplace/src/talons/SetsData/useSetsData';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './setsData.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { SetsDataShimmer } from '@riosst100/pwa-marketplace/src/components/SetsData';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import { useLocation } from 'react-router-dom';
import { getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

const SetsData = props => {
    const { categoryId } = props

    const { location } = globalThis;

    const { search } = useLocation();

    const query = new URLSearchParams(location.search);

    const [active, setActive] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [activeFilter, setActiveFilter] = useState('');
    const [activeYear, setActiveYear] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [setsFilters, setSetsFilters] = useState([]);
    
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

    const talonProps = useSetsData({ setsFilters, activeFilter, activeYear, searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab });

    const { error, loading, setsData, availableFilters, categoryUrlSuffix, categoryUrlKey, productType, filteredSetsData, availableGroups, availableYears, category, attributeData, pageInfo } = talonProps;

    if (loading) {
        return <SetsDataShimmer />;
    } else if (error) {
        return <ErrorView />;
    }

    const setsLengthArr = [];

    const newSetsData = searchQuery || activeYear ? filteredSetsData : setsData;

    // useEffect(() => {
        if (setsData && setsData.length) {
            setsData.map((setRelease, index) => {
                const { group, sets } = setRelease;

                setsLengthArr[group] = sets.length
            })
        }
    // }, [setsData])

    const splitToNChunks = (array, n) => {
        let result = [];
        for (let i = n; i > 0; i--) {
            result.push(array.splice(0, Math.ceil(array.length / i)));
        }
        return result;
    }

    let allSetsTitle = "Sets";
    let attributeCode = attributeData ? attributeData.attribute_code : '';
    let byYearTitle = "By Year";
    // if (shopby == "singles") {
    //     attributeCode = "lego_set_name";
    //     // allSetsTitle = "Singles";
    //     byYearTitle = "By Year";
    // }

    let newfilterSearchArr = search ? search.split('&') : [];
    newfilterSearchArr = newfilterSearchArr.filter(function(data) {
        return !data.includes(attributeCode + '%5Bfilter%5D') && !data.includes('shopby');
    });
    
    let filterSearch = newfilterSearchArr.join('&')

    if (!filterSearch.includes('?')) {
        filterSearch = '?'+filterSearch;
    }

    const setRelases = newSetsData && newSetsData.length && newSetsData.map((setRelease, index) => {
        const { group, release_year, sets } = setRelease;

        const setsResult = [];
        
        if (sets.length) {
            sets.map((set, index) => {
                const { products_count, set_name, option_id, release_year } = set;

                const categoryUrl = resourceUrl(
                    `/${category?.url_path}${categoryUrlSuffix || ''}${filterSearch || ''}&${attributeCode}[filter]=${set_name},${option_id}`
                );

                if (parseInt(products_count) > 0) {
                    setsResult.push(<li key={index} className='list-none'>
                        <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-0">
                            {set_name} <span className='text-[12px]'>({products_count})</span>
                        </Link>
                    </li>)
                } else {
                    setsResult.push(<li key={index} className='list-none'>
                    <span className="text-[#8f8f8f] w-full block text-[14px] py-[2px] px-0">
                        {set_name} <span className='text-[12px]'>({products_count})</span>
                    </span>
                </li>)
                }
            })
        }

        let setsResultSplitted = [];
        if (active && active == group || newSetsData.length == 1) {
            setsResultSplitted = splitToNChunks(setsResult, 3);
        }
        
        return (
            <>
                {active == "all" && activeYear && activeYear == release_year && newSetsData.length > 1 || active == "all" && !activeYear && newSetsData.length > 1 ?
                <div className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                    {shopby == "secret_lair" ? <div className='singles_item_group_letter text-[14px] font-medium border-b border-gray-100 pb-1 mb-2'>
                        {group}
                    </div> : <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                        {group}
                    </div>}
                    <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                </div> : ''}
                {active == group || newSetsData.length == 1 ? setsResultSplitted && setsResultSplitted.length && setsResultSplitted.map((setsResult, index) =>
                    <div key={index} className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                        {index == 0 ? shopby == "secret_lair" ? <div className='singles_item_group_letter text-[14px] font-medium border-b border-gray-100 pb-1 mb-2'>
                        {group}
                    </div> : <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                        {group}
                    </div> : 
                        (shopby == "secret_lair" ? <div className='singles_item_group_letter text-[14px] font-medium pb-1 mb-2' style={{"marginTop":"22px"}}></div> : <div className='singles_item_group_letter text-xl font-medium pb-1 mb-2' style={{"marginTop":"35px"}}></div>)}
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

    const handleActiveYear = (val) => {
        setActiveYear(val);
        setActive('all');
        setActiveFilter('');
        setSearchQuery('')
    }

    const handleSearchQuery = (val) => {
        setSearchQuery(val)
        setActiveYear('');
        setActive('all')
    }

    const handleSetsFilters = (code, val) => {
        setSetsFilters((prevFilters) => {
            const updated = [...prevFilters];
            const index = updated.findIndex((f) => f.code === code);

            if (index !== -1) {
                // Update value jika code sudah ada
                updated[index].value = val;
            } else {
                // Tambahkan jika belum ada
                updated.push({ code, value: val });
            }

            return updated;
        });
    };

    let alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    let title = pageInfo ? pageInfo.title : 'All S2ets';
    if (activeTab == "year") {
        title = "Sets | By Year";
    }
    
    // const availableFilters = [
    //     'Theme',
    //     'Sub-Theme',
    //     'Interest',
    //     'Age Level'
    // ];

    const handleActiveFilter = (val) => {
        setActiveFilter(val);

        setActive('all');

        setSearchQuery('')
    }

    const activeFilters = [];
    
    const allActiveFilters = getFiltersFromSearch(search);

    if (allActiveFilters && allActiveFilters.size > 0) {
        allActiveFilters.forEach((value, key) => {
            value.forEach((value) => {
                const filterArr = value.split(',');
                
                const label = filterArr[0];
                const optionId = filterArr[1];
                if (label == "Singles") {
                    isSingles = true;
                }
                if (key == "bricks_categories" || key == "sc_sports_categories" || key == "card_game" || key == "product_line" && urlKey == "brands" || key == "product_line" && urlKey == "franchise" || key == "franchise" && urlKey == "brands" || key == "franchise" && urlKey == "franchise" || key == "brands" && urlKey == "franchise" || key == "brands" && urlKey == "brands") {
                    activeFilters.push(
                        {
                            'label': label,
                            'code': key,
                            'option_id': optionId
                        }
                    )
                }
            })
        });
    }

    return (
        <Fragment>
            <StoreTitle>{title}</StoreTitle>
            <Breadcrumbs categoryId={categoryId} currentFilter={activeFilters} customPage={shopby == "singles" ? "Mini-Figures" : title} />
            {pageInfo && !pageInfo.hide_title && <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {title}
            </h1>}
            {shopby == "secret_lair" ? <>
                <ul className={classes.nav}>
                    {availableYears.map((group, index) => (
                    <li key={index} className={classes.nav_item}>
                        <button
                            onClick={() => {
                                handleActiveYear(group)
                            }}
                        >
                            {activeYear == group ? <b>{group}</b> : group}
                        </button>
                    </li>
                    ))}
                    <li key={"all"} className={classes.nav_item}>
                        <button
                            onClick={() => {
                                handleActiveYear('')
                            }}
                        >
                            {!activeYear ? <b>All Year</b> : 'All Year'}
                        </button>
                    </li>
                </ul>
            </> : ''}
            {availableFilters ? <>
                {availableFilters.map(({code, options}, index) => (
                <ul className={classes.nav} key={index}>
                    {options.map((value, index) => (
                        <li key={index} className={classes.nav_item}>
                            <button
                                onClick={() => {
                                    handleSetsFilters(code, value)
                                }}
                            >
                                {setsFilters.find(f => f.code === code && f.value === value) || !setsFilters.length && index == 0 ? <b>{value}</b> : value}
                            </button>
                        </li>
                    ))}
                </ul>))}
            </> : ''}
            {activeTab == "year" && availableGroups ? <ul className={classes.nav}>
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
            <li key={'all'} className={classes.nav_item}>
                <button
                    onClick={() => {
                        handleActive('all')
                    }}
                >
                    {active == 'all' ? <b>All</b> : 'All'}
                </button>
            </li>
            </ul> : ''}
            {pageInfo && pageInfo.filter_group && <ul className={classes.nav}>
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
                {availableGroups && availableGroups.length ? <li key={'all'} className={classes.nav_item}>
                    <button
                        onClick={() => {
                            handleActive('all')
                        }}
                    >
                        {active == 'all' ? <b>All</b> : 'All'}
                    </button>
                </li> : ''}
            </ul>}
            <div className='border border-gray-100 px-6'>
                {setsData ? (
                    <div
                        className={classes.toolbar}
                    >
                        <div style={{"width":"35%"}}><ArraySearchInput active={active} searchQuery={searchQuery} placeholder="Search sets..." isOpen={true} setSearchQuery={handleSearchQuery} /></div>
                        {/* <CustomSortBy sortProps={sortProps} availableSortMethods={availableSortBy} /> */}
                    </div>
                ) : ''}
                {shopby != "secret_lair" && <section className='single_list-indexing-container relative m-auto pt-5'>
                    {shopby != "secret_lair" && !activeFilter && activeTab != "year" && <ul className='flex gap-2 justify-center flex-wrap'>
                        <li key={'all'}>
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
                </section>}
                <Divider className="mb-5 px-4 mt-5" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block', classes.singlesWrapper)}>
                        {setsData && Object.keys(setsData).length != 0  ? setRelases : (searchQuery ? <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found for <b>{searchQuery}</b> search query.</div> : <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No sets found.</div>)}
                    </div>
                </section>
            </div>
        </Fragment>
    );
}

export default SetsData;
