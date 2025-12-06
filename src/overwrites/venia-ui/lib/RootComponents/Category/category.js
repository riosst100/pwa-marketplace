import React, { Fragment, useMemo } from 'react';
import { shape, string } from 'prop-types';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import { useStyle } from '@magento/venia-ui/lib/classify';

import CategoryContent from './categoryContent';
import defaultClasses from './category.module.css';
import { Meta } from '@magento/venia-ui/lib/components/Head';
import { GET_PAGE_SIZE } from './category.gql';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { useIntl } from 'react-intl';
import ShopBy from '@riosst100/pwa-marketplace/src/components/ShopBy/shopBy';
import SubCategoryPage from '@riosst100/pwa-marketplace/src/components/CustomSubCategoryPage/subCategoryPage';
import ShopBySets from '@riosst100/pwa-marketplace/src/components/ShopBySets/shopBySets';
import ShopByCard from '@riosst100/pwa-marketplace/src/components/ShopByCard/shopByCard';
import { useLocation } from 'react-router-dom';
import SportCardsSets from '@riosst100/pwa-marketplace/src/components/SportCardsSets/sportCardsSets';
import NonSportCardsSets from '@riosst100/pwa-marketplace/src/components/NonSportCardsSets/nonSportCardsSets';
import LegoSets from '@riosst100/pwa-marketplace/src/components/LegoSets/legoSets';
import TrainsSets from '@riosst100/pwa-marketplace/src/components/TrainsSets/trainsSets';
import SetsData from '@riosst100/pwa-marketplace/src/components/SetsData/setsData';
import FilterContent from '@riosst100/pwa-marketplace/src/components/FilterContent/filterContent';
import ShowMore from '@riosst100/pwa-marketplace/src/components/ShowMore/showMore';

const MESSAGES = new Map().set(
    'NOT_FOUND',
    "Looks like the category you were hoping to find doesn't exist. Sorry about that."
);

const Category = props => {
    const { uid } = props;
    const { formatMessage } = useIntl();

    const { location } = globalThis;

    const { pathname } = useLocation();

    const pathnameArr = pathname.split('/');

    const parentCategoryUrlKey = pathnameArr[pathnameArr.length - 2].replace('.html','');

    const query = new URLSearchParams(location.search);
    const shopby = query.get('shopby') || null;
    const showMoreGamesOrCategories = query.get('show_more') || null;

    const sidebarFilterShowMore = query.get('filterby') || null;

    const talonProps = useCategory({
        id: uid,
        queries: {
            getPageSize: GET_PAGE_SIZE
        }
    });

    const {
        error,
        metaDescription,
        loading,
        categoryData,
        pageControl,
        sortProps,
        pageSize,
        categoryNotFound
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    if (!categoryData) {
        if (error && pageControl.currentPage === 1) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        }
    }
    if (categoryNotFound) {
        return (
            <ErrorView
                message={formatMessage({
                    id: 'category.notFound',
                    defaultMessage: MESSAGES.get('NOT_FOUND')
                })}
            />
        );
    }
    
    const categoryContent = useMemo(() => {
        if (sidebarFilterShowMore) {
            return (
                <FilterContent
                    categoryId={uid}
                    classes={classes}
                    data={categoryData}
                    filterby={sidebarFilterShowMore}
                    isLoading={loading}
                    pageControl={pageControl}
                    sortProps={sortProps}
                    pageSize={pageSize} 
                />
            );
        }

        if (showMoreGamesOrCategories) {
            return (
                <ShowMore
                    categoryId={uid}
                    shopby={showMoreGamesOrCategories}
                    isLoading={loading}
                />
            );
        }
        
        if (
            shopby == "release_year" 
            || shopby == "secret_lair" 
            || shopby == "expansion_sets" 
            || shopby == "sets" 
            || shopby == "release"
        ) {
            return (
                <SetsData
                    categoryId={uid}
                    shopby={shopby}
                    isLoading={loading} 
                />

            );
        }

        if (
            shopby == "singles" 
            || shopby == "lego_set_name" 
            && parentCategoryUrlKey == "lego"
        ) {
            return (
                <LegoSets
                    categoryId={uid}
                    shopby={shopby}
                    isLoading={loading} 
                />
            );
        }

        if (shopby && parentCategoryUrlKey == "non-sports-cards") {
            return (
                <NonSportCardsSets
                    categoryId={uid}
                    shopby={shopby}
                    isLoading={loading} 
                />
            );
        }

        if (
            shopby == "sc_baseball_players" 
            || shopby == "sc_baseball_teams" 
            || shopby == "release" 
            && parentCategoryUrlKey == "sport-cards"
        ) {
            return (
                <SportCardsSets
                    categoryId={uid}
                    shopby={shopby}
                    isLoading={loading} 
                />
            );
        }

        if (shopby) {
            return (
                <ShopBy
                    categoryId={uid}
                    shopby={shopby}
                    isLoading={loading}
                />
            );
        }
        return (
            <CategoryContent
                categoryId={uid}
                classes={classes}
                data={categoryData}
                shopby={shopby}
                isLoading={loading}
                pageControl={pageControl}
                sortProps={sortProps}
                pageSize={pageSize}
            />
        );
    }, [
        uid,
        classes,
        categoryData,
        shopby,
        loading,
        pageControl,
        sortProps,
        pageSize,
        sidebarFilterShowMore,
        showMoreGamesOrCategories,
        parentCategoryUrlKey
    ]);

    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            {categoryContent}
        </Fragment>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    uid: string
};

Category.defaultProps = {
    uid: 'Mg=='
};

export default Category;
