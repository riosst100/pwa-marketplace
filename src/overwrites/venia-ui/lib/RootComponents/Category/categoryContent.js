import React, { useEffect, Fragment, Suspense, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, number, shape, string } from 'prop-types';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '../../components/Breadcrumbs';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import Gallery, { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Pagination from '../../components/Pagination';
import ProductSort, { ProductSortShimmer } from '../../components/ProductSort';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import defaultClasses from './category.module.css';
import NoProductsFound from './NoProductsFound';
import cn from 'classnames';
import ProductListTab, { ProductListTabShimmer } from '@riosst100/pwa-marketplace/src/components/ProductListTab';
import SubCategory from '@riosst100/pwa-marketplace/src/components/SubCategory/subCategory';
import AttributesBlock from '@riosst100/pwa-marketplace/src/components/AttributesBlock/attributesBlock';

import BrandSlider from '@riosst100/pwa-marketplace/src/components/BrandSlider';
import CollectibleGameSets from '@riosst100/pwa-marketplace/src/components/CollectibleGameSets/collectibleGameSets';
import { useLocation, useHistory } from 'react-router-dom';
import { getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';
import CustomSubCategory from '@riosst100/pwa-marketplace/src/components/SubCategory/customSubCategory';
import AlphaFilter from '@riosst100/pwa-marketplace/src/components/AlphaFilter';

const FilterModal = React.lazy(() => import('@magento/venia-ui/lib/components/FilterModal'));
const FilterSidebar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterSidebar')
);
const FilterTop = React.lazy(() =>
    import('@riosst100/pwa-marketplace/src/components/FilterTop')
);

const CategoryContent = props => {
    const {
        categoryId,
        data,
        shopby,
        isLoading,
        pageControl,
        sortProps,
        pageSize,
        showSubcategory
    } = props;
    const [currentSort] = sortProps;

    const history = useHistory();

    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });

    const {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        items,
        children,
        parent,
        totalCount,
        totalPagesFromData,
        attributesBlock,
        category,
        virtualCategoryFilters
    } = talonProps;

    useEffect(() => {
        if (category) {
            const urlKey = category.url_key;
            if (urlKey == "collectible-game") {
                history.replace('/games/collectible-game/magic-the-gathering.html')
            }

            if (urlKey == "sport-cards") {
                history.replace('/cards/sport-cards/baseball.html')
            }

            if (urlKey == "non-sports-cards") {
                history.replace('/cards/non-sports-cards/comics.html')
            }

            if (urlKey == "lego") {
                history.replace('/lego/lego-sets.html')
            }
        }
    }, [category]);

    const [activeLetter, setActiveLetter] = useState('all')
    const [activeTab, setActiveTab] = useState('all');

    const handleActiveLetter = (val) => {
        setActiveLetter(val);
    }

    const galleryItems = [];

    useMemo(() => {
            items && items.map((item, index) => {
                if (item) {
                    let firstLetter = null;

                    const { custom_attributes } = item;
                    if (custom_attributes) {
                        let cardName = '';
                        custom_attributes.some((attribute, index) => {
                            const { attribute_metadata, entered_attribute_value, selected_attribute_options } = attribute
                            if (attribute_metadata.code == "card_name") {
                                cardName = selected_attribute_options.attribute_option[0].label;

                                return true;
                            }

                            return false;
                        });

                        if (cardName) {
                            firstLetter = cardName.charAt(0).toUpperCase();
                        }
                    }

                    if (activeLetter == "all" || activeLetter != "all" && firstLetter == activeLetter) {
                        return galleryItems.push(item);
                    }
                }
            }),
        [items, activeLetter, activeTab]
    });

    const sidebarRef = useRef(null);
    const classes = useStyle(defaultClasses, props.classes);
    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData && availableSortMethods;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar hideFilters={category && category.hide_filters ? true : false} children={children} filters={filters} allowedFilters={category ? category.allowed_filters : []} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort
            sortProps={sortProps}
            availableSortMethods={availableSortMethods}
        />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const shouldShowProductListTab = totalPagesFromData;
    const shouldShowProductListTabShimmer = !totalPagesFromData && isLoading;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const maybeProductsTabContainer = !isLoading ? (
        <ProductListTab filters={filters} activeTab={activeTab} setActiveTab={setActiveTab} />
    ) : shouldShowProductListTabShimmer ? (
        <ProductListTabShimmer />
    ) : null;

    const categoryResultsHeading =
    galleryItems.length > 0 ? (
            <FormattedMessage
                id={'categoryContent.resultCount'}
                values={{
                    count: galleryItems.length
                }}
                defaultMessage={'{count} Results'}
            />
        ) : isLoading ? (
            <Shimmer width={5} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = useMemo(() => {
        if (!totalPagesFromData && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery = totalPagesFromData ? (
            <Gallery items={galleryItems} activeLetter={activeLetter} />
        ) : (
            <GalleryShimmer items={galleryItems} />
        );

        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} />
        ) : null;

        return (
            <Fragment>
                <section className={classes.gallery}>{gallery}</section>
                <div className={classes.pagination}>{pagination}</div>
            </Fragment>
        );
    }, [
        categoryId,
        classes.gallery,
        classes.pagination,
        isLoading,
        items,
        pageControl,
        totalPagesFromData,
        activeLetter
    ]);

    const categoryTitle = categoryName ? categoryName : <Shimmer width={5} />;

    const { search } = useLocation();
    const allActiveFilters = getFiltersFromSearch(search);

    const activeFilters = [];

    let isSingles = false;

    // console.log(allActiveFilters)

    // console.log(virtualCategoryFilters)
    const urlKey = category?.url_key;

    if (allActiveFilters && allActiveFilters.size > 0) {
        allActiveFilters.forEach((value, key) => {
            value.forEach((value) => {
                const filterArr = value.split(',');
                
                const label = filterArr[0];
                const optionId = filterArr[1];
                if (label == "Singles") {
                    isSingles = true;
                }
                if (key == "product_line" && urlKey == "brands" || key == "product_line" && urlKey == "franchise" || key == "franchise" && urlKey == "brands" || key == "franchise" && urlKey == "franchise" || key == "brands" && urlKey == "franchise" || key == "brands" && urlKey == "brands" || virtualCategoryFilters && virtualCategoryFilters.includes(key)) {
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

    const currentFilter = activeFilters && activeFilters.length ? activeFilters[activeFilters.length - 1].label : '';

    // console.log(activeFilters.length)
    // console.log(activeFilters.map(u => u.label).join(' - '))

    let title = activeFilters && activeFilters.length ? (
        activeFilters.length > 1 ? 
            activeFilters[activeFilters.length - 1].label
         : currentFilter
    ) : categoryName;

    if (shopby == "gauge") {
        title = "Trains By Gauge";
    }

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} customPage={shopby == "gauge" ? title : ''} currentFilter={activeFilters} />
            <StoreTitle>{title}</StoreTitle>
            <article className={classes.root} data-cy="CategoryContent-root">
                <div className={classes.categoryHeader}>
                    <h1 aria-live="polite" className={classes.title}>
                        <span
                            className={classes.categoryTitle}
                            data-cy="CategoryContent-categoryTitle"
                        >
                            {title}
                        </span>
                    </h1>
                    {categoryDescriptionElement}
                </div>
                {/* {activeFilters.size <= 0 && category && category.custom_landing_page ? ( */}
                    <>
                        {currentFilter && <AlphaFilter isSingles={isSingles} items={items} handleActiveLetter={handleActiveLetter} activeLetter={activeLetter} />}
                        {!currentFilter && <CustomSubCategory categoryName={category ? category.name : null} customSubCategory={category ? category.custom_subcategory : null} />}
                        {shopby != "gauge" ? <SubCategory parent={parent} children={children} /> : ''}
                        
                    </>
                {/* ) : ( */}
                    <>
                        {/* <SubCategory filters={filters} children={children} /> */}
                        <FilterTop shopby={shopby} filters={filters} category={category} children={children} allowedFilters={category ? category.allowed_filters : []} />
                        {/* <AttributesBlock category={category} attributesBlock={attributesBlock} /> */}
                        {/* <section className='category_brand-slider my-5'>
                            <BrandSlider />
                        </section> */}
                        <div className={classes.contentWrapper}>
                            <div ref={sidebarRef} className={classes.sidebar}>
                                <Suspense fallback={<FilterSidebarShimmer />}>
                                    {shouldRenderSidebarContent && category ? sidebar : null}
                                </Suspense>
                            </div>
                            <div className={classes.categoryContent}>
                                <div className={cn(classes.heading)}>
                                    {maybeProductsTabContainer}
                                    <div className={classes.headerButtons}>
                                        {maybeFilterButtons}
                                        {maybeSortButton}
                                    </div>
                                    {maybeSortContainer}
                                </div>
                                <div className={cn(classes.heading)}>
                                    <div
                                        data-cy="CategoryContent-categoryInfo"
                                        className={classes.categoryInfo}
                                    >
                                        {categoryResultsHeading}
                                    </div>
                                </div>
                                {content}
                                <Suspense fallback={null}>{filtersModal}</Suspense>
                            </div>
                        </div>
                    </>
                {/* )} */}
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        gallery: string,
        pagination: string,
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string
    }),
    // sortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    sortProps: array,
    pageSize: number
};
