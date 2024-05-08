import React, { Fragment } from 'react';
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
import { useLocation } from 'react-router-dom';
import SportCardsSets from '@riosst100/pwa-marketplace/src/components/SportCardsSets/sportCardsSets';
import LegoSets from '@riosst100/pwa-marketplace/src/components/LegoSets/legoSets';

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
    const showSubcategory = query.get('show_subcategory') || null;

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

    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            {showSubcategory ? (
                <SubCategoryPage
                categoryId={uid}
                isLoading={loading} />
            ) : (
                shopby == "lego_set_name" && parentCategoryUrlKey == "lego" ? <LegoSets
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby == "release" && parentCategoryUrlKey == "sport-cards" ? <SportCardsSets
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby == "sets" || shopby == "expansion_sets" || shopby == "release_year" ? <ShopBySets
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : (shopby ? (
                    <ShopBy
                    categoryId={uid}
                    shopby={shopby}
                    isLoading={loading} />
                ) : (
                    <CategoryContent
                    categoryId={uid}
                    classes={classes}
                    data={categoryData}
                    isLoading={loading}
                    pageControl={pageControl}
                    sortProps={sortProps}
                    pageSize={pageSize}
                    />
                ))
            )}
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
