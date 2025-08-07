import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './productListTab.module.css';
import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar';
import CurrentTopFilter from '@riosst100/pwa-marketplace/src/components/FilterTop/CurrentTopFilters/currentTopFilter';

const ProductListTab = props => {

    const { activeTab, setActiveTab, filters } = props

    const talonProps = useFilterSidebar({ filters });
    const {
        filterApi,
        filterState,
        handleApply
    } = talonProps;

    const { toggleItem, removeItem } = filterApi;

    const classes = useStyle(defaultClasses, props.classes);

    let allProductClass = classes.firstButton;
    if (!activeTab) {
        allProductClass = classes.activeFirstButton;
    }

    const productTabs = [
        {
            'label': 'All Products',
            'value': 'all'
        },
        {
            'label': 'Sale',
            'value': 'special_price'
        },
        {
            'label': 'Pre Order',
            'value': 'lof_preorder'
        },
        // {
        //     'label': 'Auction',
        //     'value': 'auction'
        // }
    ];

    const handleClickremove = useCallback((group, item) => {
        removeItem({ group, item });
        if (typeof handleApply === 'function') {
            handleApply(group, item);
        }
    }, [removeItem, handleApply]);

    const handleToggleItem = useCallback((group, item) => {
        toggleItem({ group, item });
        if (typeof handleApply === 'function') {
            handleApply(group, item);
        }
    }, [toggleItem, handleApply]);

    const handleClick = (targetGroup) => {
            setActiveTab(targetGroup);

            const item = { value: "1", label: 'Yes', title: 'Yes' };

            for (const [group, items] of filterState) {
                for (const item of items) {
                    const { title, value } = item || {};
                    const key = `${group}::${title}_${value}`;

                    if (productTabs.some(e => e.value === group)) {
                        handleClickremove(group, item)
                    }
                }
            }

            if (targetGroup != "all") {
                handleToggleItem(targetGroup, item)
            }
        }

    return (
        <div className={classes.root} aria-busy="true">
            <nav>
                <ul className={classes.buttonContainer}>
                    {productTabs.map(({label, value}, index) => 
                        <li key={index}>
                            <button onClick={() => handleClick(value)} className={
                                (index == 0 ? classes.firstButton : (index == productTabs.length-1 ? classes.lastButton : classes.middleButton)) + (activeTab == value ? ' ' + classes.activeButton : '')
                            }>{label}</button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default ProductListTab;