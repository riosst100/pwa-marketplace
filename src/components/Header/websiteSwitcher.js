import React from 'react';
import { shape, string } from 'prop-types';

import { useWebsiteSwitcher } from '@riosst100/pwa-marketplace/src/talons/Header/useWebsiteSwitcher';
import { availableRoutes } from '@magento/venia-ui/lib/components/Routes/routes';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './websiteSwitcher.module.css';
import WebsiteSwitcherItem from './websiteSwitcherItem';
import Shimmer from './websiteSwitcher.shimmer';

const WebsiteSwitcher = props => {
    const {
        availableStores,
        currentGroupName,
        currentWebsiteName,
        handleSwitchWebsite,
        storeGroups,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = useWebsiteSwitcher({ availableRoutes });

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    if (!availableStores) return <Shimmer />;

    if (availableStores.size <= 1) return null;

    const groups = [];
    const hasOnlyOneGroup = storeGroups.size === 1;

    storeGroups.forEach((group, key) => {
        const stores = [];
        group.forEach(({ storeGroupName, websiteCode, websiteName, isCurrent, storeCode }) => {
            let label = `${websiteName}`;
            stores.push(
                <li
                    aria-selected={currentWebsiteName}
                    role="option"
                    key={storeCode}
                    className={classes.menuItem}
                    data-cy="WebsiteSwitcher-view"
                >
                    <WebsiteSwitcherItem
                        active={isCurrent}
                        onClick={handleSwitchWebsite}
                        option={storeCode}
                        option2={websiteCode}
                    >
                        {label}
                    </WebsiteSwitcherItem>
                </li>
            );
        });

        groups.push(
            <ul
                role="listbox"
                className={classes.groupList}
                key={key}
                data-cy="WebsiteSwitcher-group"
            >
                {stores}
            </ul>
        );
    });

    let triggerLabel = `${currentWebsiteName}`;

    return (
        <div className={classes.root} data-cy="WebsiteSwitcher-root">
            <button
                data-cy="WebsiteSwitcher-triggerButton"
                className={classes.trigger}
                aria-label={currentWebsiteName || ''}
                onClick={handleTriggerClick}
                ref={storeMenuTriggerRef}
                aria-expanded={storeMenuIsOpen}
            >
                {triggerLabel}
            </button>
            <div
                ref={storeMenuRef}
                className={menuClassName}
                data-cy="WebsiteSwitcher-menu"
            >
                <div className={classes.groups}>{groups}</div>
            </div>
        </div>
    );
};

export default WebsiteSwitcher;

WebsiteSwitcher.propTypes = {
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
