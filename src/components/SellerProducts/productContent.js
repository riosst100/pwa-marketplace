import React, { useRef, Suspense, useState, useMemo, Fragment } from 'react';
import ProductItem from '@riosst100/pwa-marketplace/src/components/ProductItem';
import Filter from '@riosst100/pwa-marketplace/src/components/Filter';
import Search from '@riosst100/pwa-marketplace/src/components/Search';
import SortBy from '@riosst100/pwa-marketplace/src/components/SortBy';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from "react-router-dom";
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import defaultClasses from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/RootComponents/Category/category.module.css';
import { useProductContent } from '@riosst100/pwa-marketplace/src/talons/SellerProducts';
import cn from 'classnames';
import ProductListTab, { ProductListTabShimmer } from '@riosst100/pwa-marketplace/src/components/ProductListTab';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import ProductSort, { ProductSortShimmer } from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/ProductSort';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { FormattedMessage } from 'react-intl';
import NoProductsFound from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/RootComponents/Category/NoProductsFound';
import Gallery, { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery';
import Pagination from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Pagination';
import SellerMegaMenu from '@riosst100/pwa-marketplace/src/components/SellerMegaMenu';
import AlphaFilter from '@riosst100/pwa-marketplace/src/components/AlphaFilter';
import CustomSubCategory from '@riosst100/pwa-marketplace/src/components/SubCategory/customSubCategory';
import SubCategory from '@riosst100/pwa-marketplace/src/components/SubCategory/subCategory';
import { useLocation, useHistory } from 'react-router-dom';
import { getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';

const FilterSidebar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterSidebar')
);

const FilterModal = React.lazy(() => import('@magento/venia-ui/lib/components/FilterModal'));

const FilterTop = React.lazy(() =>
    import('@riosst100/pwa-marketplace/src/components/FilterTop')
);

const ProductContent = props => {
    const {
        categoryId,
        data,
        shopby,
        pageControl,
        sortProps,
        seller,
        isLoading,
        pageSize
    } = props;

    const [currentSort] = sortProps;

    const [activeTab, setActiveTab] = useState('all');
    const [activeLetter, setActiveLetter] = useState('all')

    const classes = useStyle(defaultClasses, props.classes);
    
    const sidebarRef = useRef(null);

    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    const talonProps = useProductContent({
        categoryId,
        data,
        pageSize
    });

    const {
        availableSortMethods,
        filters,
        items,
        category,
        children,
        categoryName,
        totalPagesFromData
    } = talonProps;

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar hideFilters={false} children={[]} filters={filters} allowedFilters={[]} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const shouldShowProductListTabShimmer = !totalPagesFromData && isLoading;

    const maybeProductsTabContainer = !isLoading ? (
        <ProductListTab filters={filters} activeTab={activeTab} setActiveTab={setActiveTab} />
    ) : shouldShowProductListTabShimmer ? (
        <ProductListTabShimmer />
    ) : null;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const shouldShowSortButtons = totalPagesFromData && availableSortMethods;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort
            sortProps={sortProps}
            availableSortMethods={availableSortMethods}
        />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

     const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

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
    
    const { search } = useLocation();
    const allActiveFilters = getFiltersFromSearch(search);

    const activeFilters = [];

    let isSingles = false;

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
                if (key == "bricks_categories" || key == "sc_sports_categories" || key == "card_game" || key == "product_line" && urlKey == "brands" || key == "product_line" && urlKey == "franchise" || key == "franchise" && urlKey == "brands" || key == "franchise" && urlKey == "franchise" || key == "brands" && urlKey == "franchise" || key == "brands" && urlKey == "brands" || virtualCategoryFilters && virtualCategoryFilters.includes(key)) {
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

    let title = categoryName;

    return (
        <>
            <div className='w-full mb-[30px]'>
                <SellerMegaMenu
                    rootClassName={cn('nav-menu w-full max-w-[1210px] px-[15px] mx-[auto] flex-row gap-x-[40px]')}
                    sellerMegaMenuItemClassname={cn('px-0 py-[10px] leading-[20px]')}
                    seller={seller}
                    titleClassName={cn('font-normal leading-[20px]')}
                />
            </div>
            <div className='w-full mb-[0px]'>
                <div className={classes.categoryHeader}>
                    <h1 aria-live="polite" className={classes.title}>
                        <span
                            className={classes.categoryTitle}
                            data-cy="CategoryContent-categoryTitle"
                        >
                            {title}
                        </span>
                    </h1>
                </div>
                <>
                    {currentFilter && <AlphaFilter isSingles={isSingles} items={items} handleActiveLetter={handleActiveLetter} activeLetter={activeLetter} />}
                    {!currentFilter && <CustomSubCategory categoryName={category ? category.name : null} customSubCategory={category ? category.custom_subcategory : null} />}
                    {shopby != "gauge" && category?.name != "Collectible Card Games" ? <SubCategory parent={parent} children={children} /> : ''}
                    
                </>
                <FilterTop shopby={shopby} filters={filters} category={category} children={children} allowedFilters={category ? category.allowed_filters : []} />
            </div>
            <div className='w-full flex items-start gap-x-[30px]'>
                <div className={classes.contentWrapper}>
                    <div ref={sidebarRef} className={classes.sidebar}>
                        <Suspense fallback={<FilterSidebarShimmer />}>
                            {shouldRenderSidebarContent ? sidebar : null}
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
            </div>
        </>
    )
}

export default ProductContent;