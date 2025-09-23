import React from 'react';
import { shape, string } from 'prop-types';

import { useWebsiteSwitcher } from '@riosst100/pwa-marketplace/src/talons/WebsiteSwitcher/useWebsiteSwitcher';
import { availableRoutes } from '@magento/venia-ui/lib/components/Routes/routes';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './websiteSwitcher.module.css';
import WebsiteSwitcherItem from './websiteSwitcherItem';
import Shimmer from './websiteSwitcher.shimmer';
import cn from 'classnames';
import { ArrowUp2 } from 'iconsax-react';
import { darkBlue } from '@riosst100/pwa-marketplace/src/theme/vars';

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
        group.forEach(({ websiteCode, websiteName, isCurrent, storeCode }) => {
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
                className={'text-base'}
                key={key}
                data-cy="WebsiteSwitcher-group"
            >
                {stores}
            </ul>
        );
    });

    let triggerLabel = currentWebsiteName ? `${currentWebsiteName}` : '';

    return (
        <div className={cn(classes.root, 'leading-[16px]')} data-cy="WebsiteSwitcher-root">
            <button
                data-cy="WebsiteSwitcher-triggerButton"
                className={cn(classes.trigger, 'text-base')}
                aria-label={currentWebsiteName || ''}
                onClick={handleTriggerClick}
                ref={storeMenuTriggerRef}
                aria-expanded={storeMenuIsOpen}
            >
                <span className='flex flex-row gap-[5px] items-center leading-[16px]'>
                    {triggerLabel || ''}
                    {!hasOnlyOneGroup ? (
                        <ArrowUp2 size="12" color={darkBlue} className={cn(storeMenuIsOpen ? 'rotate-0 ' : 'rotate-180', 'transition-all stroke-current')} variant="Outline" />
                    ) : null}
                </span>
            </button>
            <div
                ref={storeMenuRef}
                className={menuClassName}
                data-cy="WebsiteSwitcher-menu"
            >
                <div className={classes.groups}>
                    <span className='flex font-medium px-4 py-1 w-full text-base mb-2'>
                        Country
                    </span>
                    {groups}
                </div>
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
