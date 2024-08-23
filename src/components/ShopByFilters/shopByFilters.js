import React from 'react';
// import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
// import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
// import { useShopByFilters } from '@riosst100/pwa-marketplace/src/talons/ShopByFilters/useShopByFilters';
// import { Link } from 'react-router-dom';
// import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './shopByFilters.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
// import cn from 'classnames';
// import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
// import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';
// import ArraySearchInput from '@riosst100/pwa-marketplace/src/components/ArraySearchInput';
// import { useCustomSort } from '@riosst100/pwa-marketplace/src/hooks/useCustomSort';
// import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';

const ShopByFilters = props => {
    const { activeFilter, handleActiveFilter, category } = props;

    const classes = useStyle(defaultClasses);

    // const talonProps = useShopByFilters({ activeFilter, searchQuery, setActive, currentSort, shopby, setType, categoryId, activeTab });

    // const { error, loading, shopByBrands, categoryUrlSuffix, categoryUrlKey, productType, filteredShopByBrands, availableGroups, category } = talonProps;

    // if (loading && !shopByBrands)
    //     return <ShopByBrandsShimmer />;
    // if (error && !shopByBrands) return <ErrorView />;

    // if (!shopByBrands && !loading && !error) {
    //     return <ShopByBrandsShimmer />;
    // }

    // url_path
    
    let availableShopByFilters = [];
    
    if (category.url_path.includes('model-railway')) {
        availableShopByFilters = [
            'N Scale',
            'HO Scale',
            'O Scale',
            'G Scale',
            'S Scale',
            'Z Scale'
        ];
    }

    return (
        <ul className={classes.nav}>
            {availableShopByFilters.map((label, index) => (
            <li key={index} className={classes.nav_item}>
                <button
                    onClick={() => {
                        handleActiveFilter(label)
                    }}
                >
                    {activeFilter == label ? <b>{label}</b> : label}
                </button>
            </li>
            ))}
            <li className={classes.nav_item}>
                <button
                    onClick={() => {
                        handleActiveFilter('')
                    }}
                >
                    {!activeFilter ? <b>All</b> : 'All'}
                </button>
            </li>
        </ul>
    );
}

export default ShopByFilters;
