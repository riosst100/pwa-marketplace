import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useSellerProducts } from '@riosst100/pwa-marketplace/src/talons/SellerProducts';
import { useStyle } from '@magento/venia-ui/lib/classify';

import ProductContent from './productContent';
import defaultClasses from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/RootComponents/Category/category.module.css';
import { Meta } from '@magento/venia-ui/lib/components/Head';
import { GET_PAGE_SIZE } from '@magento/venia-ui/lib/RootComponents/Category/category.gql';
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

const MESSAGES = new Map().set(
    'NOT_FOUND',
    "Looks like the category you were hoping to find doesn't exist. Sorry about that."
);

const SellerProducts = props => {
    const { sellerId, seller } = props;

    const uid = null;
    
    const { formatMessage } = useIntl();

    const { location } = globalThis;

    const query = new URLSearchParams(location.search);
    const shopby = query.get('shopby') || null;
    const showSubcategory = query.get('show_subcategory') || null;

    const talonProps = useSellerProducts({
        sellerId: sellerId,
        queries: {
            getPageSize: GET_PAGE_SIZE
        }
    });

    const {
        error,
        loading,
        productData,
        pageControl,
        sortProps,
        categoryId,
        pageSize,
        categoryNotFound
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    if (!productData) {
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

    const allowedShopby = ['card_artist'];

    return (
        <Fragment>
            {showSubcategory ? (
                <SubCategoryPage
                categoryId={uid}
                isLoading={loading} />
            ) : (
                allowedShopby.includes(shopby) ? <ShopBy
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby == "release_year" || shopby == "secret_lair" || shopby == "expansion_sets" || shopby == "sets" || shopby == "release" ? <SetsData
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby == "singles" || shopby == "lego_set_name" && parentCategoryUrlKey == "lego" ? <LegoSets
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby && parentCategoryUrlKey == "non-sports-cards" ? <NonSportCardsSets
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby == "sc_baseball_players" || shopby == "sc_baseball_teams" || shopby == "release" && parentCategoryUrlKey == "sport-cards" ? <SportCardsSets
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby == "release_year" ? <ShopBySets
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : shopby == "card" ? <ShopByCard
                categoryId={uid}
                shopby={shopby}
                isLoading={loading} /> : (shopby && shopby != "gauge" ? (
                    <ShopBy
                    categoryId={uid}
                    shopby={shopby}
                    isLoading={loading} />
                ) : (
                    <ProductContent
                    categoryId={categoryId}
                    sellerId={sellerId}
                    seller={seller}
                    classes={classes}
                    data={productData?.productsBySellerId}
                    shopby={shopby}
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

SellerProducts.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    uid: string
};

SellerProducts.defaultProps = {
    uid: 'Mg=='
};

export default SellerProducts;
