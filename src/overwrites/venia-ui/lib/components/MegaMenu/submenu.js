import React from 'react';
import PropTypes from 'prop-types';

import { useSubMenu } from '@magento/peregrine/lib/talons/MegaMenu/useSubMenu';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './submenu.module.css';
import SubmenuColumn from './submenuColumn';
import ShopByColumn from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/MegaMenu/shopByColumn';

/**
 * The Submenu component displays submenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const Submenu = props => {
    const {
        items,
        shopByItems,
        mainNavWidth,
        isFocused,
        subMenuState,
        handleCloseSubMenu,
        categoryUrlSuffix,
        parentCategory,
        onNavigate,
        arrow
    } = props;
    const PADDING_OFFSET = 20;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useSubMenu({
        isFocused,
        subMenuState,
        handleCloseSubMenu
    });

    const { isSubMenuActive } = talonProps;

    const subMenuClassname = isSubMenuActive
        ? classes.submenu_active
        : classes.submenu_inactive;

    const subMenus = items.map((category, index) => {
        const keyboardProps =
            index === items.length - 1 ? talonProps.keyboardProps : {};
        return (
            <SubmenuColumn
                index={index}
                keyboardProps={keyboardProps}
                key={category.uid}
                category={category}
                categoryUrlSuffix={categoryUrlSuffix}
                onNavigate={onNavigate}
                arrow={arrow}
                handleCloseSubMenu={handleCloseSubMenu}
            />
        );
    });

    // const shopByItems = [
    //     {
    //         name: 'Shop By Franchise',
    //         items: [
    //             {
    //                 name: 'Hasbro',
    //                 url: '/'
    //             }
    //         ]
    //     }
    // ];

    const shopBy = shopByItems.map((shopBy, index) => {
        const keyboardProps =
            index === shopByItems.length - 1 ? talonProps.keyboardProps : {};
        return (
            <ShopByColumn
                index={index}
                keyboardProps={keyboardProps}
                key={shopBy.code}
                category={parentCategory}
                shopBy={shopBy}
                categoryUrlSuffix={categoryUrlSuffix}
                onNavigate={onNavigate}
                handleCloseSubMenu={handleCloseSubMenu}
            />
        );
    });

    return (
        <div className={subMenuClassname}>
            <div className={classes.submenuContainer}>
                <div
                    className={classes.submenuItems}
                >
                    {subMenus}
                </div>
                {shopBy}
            </div>
        </div>
    );
};

export default Submenu;
