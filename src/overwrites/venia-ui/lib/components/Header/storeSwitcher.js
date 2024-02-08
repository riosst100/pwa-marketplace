import React from 'react';
import { shape, string } from 'prop-types';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';
import { availableRoutes } from '@magento/venia-ui/lib/components/Routes/routes';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Header/storeSwitcher.module.css';
import SwitcherItem from '@magento/venia-ui/lib/components/Header/switcherItem';
import Shimmer from '@magento/venia-ui/lib/components/Header/storeSwitcher.shimmer';

const StoreSwitcher = props => {
    const {
        availableStores,
        currentGroupName,
        currentStoreName,
        handleSwitchStore,
        storeGroups,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = useStoreSwitcher({ availableRoutes });

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    if (!availableStores) return <Shimmer />;

    const groups = [];

    storeGroups.forEach((group, key) => {
        const stores = [];
        group.forEach(({ storeName, isCurrent, storeCode, websiteCode }) => {
            let label = `${storeName}`;
            
            stores.push(
                <li
                    aria-selected={currentStoreName}
                    role="option"
                    key={storeCode}
                    className={classes.menuItem}
                    data-cy="StoreSwitcher-view"
                >
                    <SwitcherItem
                        active={isCurrent}
                        onClick={handleSwitchStore}
                        option={storeCode}
                        option2={websiteCode}
                    >
                        {label}
                    </SwitcherItem>
                </li>
            );
        });

        groups.push(
            <ul
                role="listbox"
                className={classes.groupList}
                key={key}
                data-cy="StoreSwitcher-group"
            >
                {stores}
            </ul>
        );
    });

    return (
        <div className={classes.root} data-cy="StoreSwitcher-root">
            <button
                data-cy="StoreSwitcher-triggerButton"
                className={classes.trigger}
                aria-label={currentStoreName || ''}
                onClick={handleTriggerClick}
                ref={storeMenuTriggerRef}
                data-cy="StoreSwitcher-trigger"
                aria-expanded={storeMenuIsOpen}
            >
                {currentStoreName || ''}
            </button>
            <div
                ref={storeMenuRef}
                className={menuClassName}
                data-cy="StoreSwitcher-menu"
            >
                <div className={classes.groups}>{groups}</div>
            </div>
        </div>
    );
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    classes: shape({
        groupList: string,
        groups: string,
        menu: string,
        menu_open: string,
        menuItem: string,
        root: string,
        trigger: string
    })
};
