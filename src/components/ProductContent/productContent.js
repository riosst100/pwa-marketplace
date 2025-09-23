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
import { useProductContent } from '@riosst100/pwa-marketplace/src/talons/ProductContent';
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

const FilterSidebar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterSidebar')
);

const ProductContent = props => {
    const {
        categoryId,
        data,
        pageControl,
        sortProps,
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
        totalPagesFromData
    } = talonProps;

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // console.log('shouldShowFilterButtons')
    // console.log(shouldShowFilterButtons)

    // console.log('filters')
    // console.log(filters)

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

    return <><span>OK</span></>;
    return (
        <>
            <div className='w-full mb-[30px]'>
                <div class='flex items-end gap-[40px] px-[30px] py-0 rounded-[6px] border border-solid border-gray-100'>
                    <Link to='#' class='px-0 py-[12px] inline-flex items-center gap-[5px] relative flex-[0_0_auto]'>
                        <span class='relative w-fit font-medium text-[14px] tracking-[0] leading-[20px] whitespace-nowrap'>Action Figures</span>
                    </Link>
                    <Link to='#' class='px-0 py-[12px] inline-flex items-center gap-[5px] relative flex-[0_0_auto]'>
                        <span class='relative w-fit font-medium text-[14px] tracking-[0] leading-[20px] whitespace-nowrap'>Anime</span>
                    </Link>
                </div>
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