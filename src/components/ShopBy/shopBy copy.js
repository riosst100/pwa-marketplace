import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './shopBy.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { ShopByShimmer } from '@riosst100/pwa-marketplace/src/components/ShopBy';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
import { useShopBy } from '@riosst100/pwa-marketplace/src/talons/ShopBy/useShopBy';

const ShopBy = props => {
    const [active, setActive] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');

    
    const sortProps = useCustomSort({ sortFromSearch: false, defaultSort: {
        sortText: 'All (A-Z)',
        value: 'all'
    }});

    const [currentSort] = sortProps;

    // const [sortBy, setSortBy] = useState({
    //     sortText: 'All (A-Z)',
    //     value: 'all'
    // });


    const classes = useStyle(defaultClasses);

    const talonProps = useShopBy({ searchQuery, setActive, currentSort });

    const { error, loading, dataResult, categoryUrlSuffix, categoryUrlKey, productType, filteredCollectibleGameSets, availableGroups, attributeData, alpha, category } = talonProps;

    if (loading && !dataResult)
        return <ShopByShimmer />;
    if (error && !dataResult) return <ErrorView />;

    if (!dataResult && !loading && !error) {
        return <ShopByShimmer />;
    }

    const newData = searchQuery ? filteredCollectibleGameSets : dataResult;

    const setRelases = availableGroups.map((group, index) => {
        const optionsResult = [];

        if (active === 'all' || active === group) {
            dataResult[group].map((option, index) => {
                const { label, value } = option;

                const categoryUrl = resourceUrl(
                    `/${categoryUrlKey}${categoryUrlSuffix || ''}?${attributeData.attribute_code}[filter]=${label},${value}`
                );

                optionsResult.push(<li className='list-none'>
                    <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2">
                        {label}
                    </Link>
                </li>)
            })

            return (
                <>
                    {optionsResult ?
                    <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                        <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                            {group}
                        </div>
                        <div className={cn('singles_item-list flex flex-col')}>{optionsResult}</div>
                    </div> : ''}
                </>
            );
        }
        
        return null;
    });

    const handleActive = (val) => {
        setActive(val);

        // 


        setSearchQuery('')
    }

    let availableSortBy = [
        {
            'label': 'All (A-Z)',
            'value': 'all'
        }
    ];

    let title = "All Sets";
    if (productType == "expansion-sets") {
        title = "Expansion Sets";
    } else if (productType == "artist") {
        title = "Artist";
    }

    return (
        <Fragment>
            <StoreTitle>{title}</StoreTitle>
            <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {attributeData ? 'By ' + attributeData.label : 'Shop By'}
            </h1>
            <div className='border border-gray-100 px-6'>
                {dataResult ? (
                    <div
                        className={classes.toolbar}
                    >
                        <div style={{"width":"35%"}}><ArraySearchInput active={active} searchQuery={searchQuery} placeholder="Search sets..." isOpen={true} setSearchQuery={setSearchQuery} /></div>
                        <CustomSortBy sortProps={sortProps} availableSortMethods={availableSortBy} />
                    </div>
                ) : ''}
                {productType != "expansion-sets" ? (
                    <>
                        <section className='single_list-indexing-container relative m-auto py-10'>
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
                                                availableGroups.includes(letter) > 0 ? 'hover_bg-gray-50' : 'bg-gray-100 text-gray-400',
                                            )}
                                            onClick={() => {
                                                handleActive(letter)
                                            }}
                                            disabled={availableGroups.includes(letter) > 0 ? false : true}
                                        >
                                            {active == letter ? <b>{letter}</b> : letter}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                ) : ''}
                <Divider className="mb-5 px-4 mt-5" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {Object.keys(dataResult).length != 0 ? setRelases : (searchQuery ? <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No data found for <b>{searchQuery}</b> search query.</div> : <div className='singles_group-wrapper mb-4 px-2 inline-block w-full'>No data found.</div>)}
                    </div>
                </section>
            </div>
        </Fragment>
    );
}

export default ShopBy;
