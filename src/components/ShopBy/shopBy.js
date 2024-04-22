import React, { Fragment, Suspense, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, number, shape, string } from 'prop-types';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import Gallery, { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import ProductSort, { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import NoProductsFound from '@magento/venia-ui/lib/RootComponents/Category/NoProductsFound';
import cn from 'classnames';
import ProductListTab, { ProductListTabShimmer } from '@riosst100/pwa-marketplace/src/components/ProductListTab';
import SubCategory from '@riosst100/pwa-marketplace/src/components/SubCategory/subCategory';
import AttributesBlock from '@riosst100/pwa-marketplace/src/components/AttributesBlock/attributesBlock';

import BrandSlider from '@riosst100/pwa-marketplace/src/components/BrandSlider';
import CollectibleGameSets from '@riosst100/pwa-marketplace/src/components/CollectibleGameSets/collectibleGameSets';
import { useLocation } from 'react-router-dom';
import { getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';
import CustomSubCategory from '@riosst100/pwa-marketplace/src/components/SubCategory/customSubCategory';
import AlphaFilter from '@riosst100/pwa-marketplace/src/components/AlphaFilter';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './shopBy.module.css';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { ShopByShimmer } from '@riosst100/pwa-marketplace/src/components/ShopBy';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
import { useShopBy } from '@riosst100/pwa-marketplace/src/talons/ShopBy/useShopBy';

const FilterModal = React.lazy(() => import('@magento/venia-ui/lib/components/FilterModal'));
const FilterSidebar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterSidebar')
);
const FilterTop = React.lazy(() =>
    import('@riosst100/pwa-marketplace/src/components/FilterTop')
);

const ShopBy = props => {
    const {
        categoryId,
        shopby
    //     data,
    //     isLoading,
    //     pageControl,
    //     sortProps,
    //     pageSize
    } = props;
    // const [currentSort] = sortProps;

    // const talonProps = useCategoryContent({
    //     categoryId,
    //     data,
    //     pageSize
    // });

    // const {
    //     availableSortMethods,
    //     categoryName,
    //     categoryDescription,
    //     filters,
    //     items,
    //     children,
    //     parent,
    //     totalCount,
    //     totalPagesFromData,
    //     attributesBlock,
    //     category,
    //     virtualCategoryFilters
    // } = talonProps;
    
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

    const talonProps = useShopBy({ searchQuery, setActive, currentSort, categoryId, shopby });

    const { error, loading, dataResult, categoryUrlSuffix, categoryUrlKey, productType, filteredAvailableGroups, availableGroups, attributeData, alpha, category } = talonProps;

    if (loading && !dataResult)
        return <ShopByShimmer />;
    if (error && !dataResult) return <ErrorView />;

    if (!dataResult && !loading && !error) {
        return <ShopByShimmer />;
    }

    const newAvailableGroups = searchQuery ? filteredAvailableGroups : availableGroups;

    const splitToNChunks = (array, n) => {
        let result = [];
        for (let i = n; i > 0; i--) {
            result.push(array.splice(0, Math.ceil(array.length / i)));
        }
        return result;
    }

    const setRelases = newAvailableGroups.map((group, index) => {
        const optionsResult = [];

        if (active === 'all' || active === group) {
            dataResult[group].map((option, index) => {
                const { label, value } = option;

                const categoryUrl = resourceUrl(
                    `/${category.url_path}${categoryUrlSuffix || ''}?${attributeData.attribute_code}[filter]=${label},${value}`
                );

                optionsResult.push(<li className='list-none'>
                    <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2">
                        {label}
                    </Link>
                </li>)
            })

            let optionsResultSplitted = [];
            if (active == group) {
                optionsResultSplitted = splitToNChunks(optionsResult, 3);
            }

            return (
                <>
                    {optionsResult && active == "all" ?
                    <div className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                        <div className='singles_item_group_letter text-xl font-semibold border-b border-gray-100 pb-1 mb-2' >
                            {group}
                        </div>
                        <div className={cn('singles_item-list flex flex-col')}>{optionsResult}</div>
                    </div> : ''}
                    {active == group ? optionsResultSplitted && optionsResultSplitted.length && optionsResultSplitted.map((optionsResult, index) =>
                        <div key={index} className={cn('singles_group-wrapper mb-4 px-2 inline-block', classes.singlesGroupWrapper)}>
                            {index == 0 ? <div className='singles_item_group_letter text-xl font-semibold border-b border-gray-100 pb-1 mb-2'>{group}</div> : 
                            <div className='singles_item_group_letter text-xl font-semibold pb-1 mb-2' style={{"marginTop":"35px"}}></div>}
                            <div className={cn('singles_item-list flex flex-col')}>{optionsResult}</div>
                        </div>
                    )
                    : ''}
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

    return (
        <Fragment>
            <StoreTitle>{attributeData ? 'By ' + attributeData.label : 'Shop By'}</StoreTitle>
            <Breadcrumbs categoryId={categoryId} customPage={'By ' + attributeData.label} />
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
};

export default ShopBy;
