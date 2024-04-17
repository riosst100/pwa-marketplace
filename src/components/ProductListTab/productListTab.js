import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './productListTab.module.css';
import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar';

const ProductListTab = props => {

    const { activeTab, setActiveTab, filters } = props

    const talonProps = useFilterSidebar({ filters });
    const {
        filterApi,
        handleApply
    } = talonProps;

    const { toggleItem, removeGroup, removeItem } = filterApi;

    const filterRef = useRef();

    const handleApplyFilter = useCallback(
        (...args) => {
            const filterElement = filterRef.current;
            if (
                filterElement &&
                typeof filterElement.getBoundingClientRect === 'function'
            ) {
                const filterTop = filterElement.getBoundingClientRect().top;
                const windowScrollY =
                    window.scrollY + filterTop - SCROLL_OFFSET;
                window.scrollTo(0, windowScrollY);
            }

            handleApply(...args);
        },
        [handleApply, filterRef]
    );

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
            'value': 'sale'
        },
        {
            'label': 'Pre Order',
            'value': 'lof_preorder'
        },
        {
            'label': 'Auction',
            'value': 'auction'
        }
    ];

    const handleClick = useCallback(
        group => {
            setActiveTab(group);

            const item = { value: "1", label: 'Yes', title: 'Yes' };

            productTabs.map(({ value: toRemoveGroup }, index) => {
                removeItem({ toRemoveGroup, item });
            })

            toggleItem({group, item});

            if (typeof handleApplyFilter === 'function') {
                handleApplyFilter(group, item);
            }
        },
        [handleApplyFilter, removeGroup, toggleItem]
    );

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