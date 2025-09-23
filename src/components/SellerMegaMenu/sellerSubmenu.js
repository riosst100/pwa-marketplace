import React from 'react';
import PropTypes from 'prop-types';

import { useSellerSubMenu } from '@riosst100/pwa-marketplace/src/talons/SellerMegaMenu/useSellerSubMenu';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './sellerSubmenu.module.css';
import SellerSubmenuColumn from './sellerSubmenuColumn';
import ShopByColumn from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/MegaMenu/shopByColumn';
import CustomSubmenuColumn from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/MegaMenu/customSubmenuColumn';
import cn from 'classnames';

/**
 * The Submenu component displays sellerSubmenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the sellerSubmenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const SellerSubmenu = props => {
    const {
        items,
        shopByItems,
        mainNavWidth,
        seller,
        isFocused,
        sellerSubMenuState,
        handleCloseSellerSubMenu,
        categoryUrlSuffix,
        parentCategory,
        onNavigate,
        arrow
    } = props;
    const PADDING_OFFSET = 20;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useSellerSubMenu({
        isFocused,
        sellerSubMenuState,
        handleCloseSellerSubMenu
    });

    const { isSellerSubMenuActive } = talonProps;

    const subMenuClassname = isSellerSubMenuActive
        ? classes.sellerSubmenu_active
        : classes.sellerSubmenu_inactive;

    const subMenus = items.map((category, index) => {
        const keyboardProps =
            index === items.length - 1 ? talonProps.keyboardProps : {};
        return (
            <SellerSubmenuColumn
                index={index}
                keyboardProps={keyboardProps}
                key={category.uid}
                category={category}
                seller={seller}
                categoryUrlSuffix={categoryUrlSuffix}
                onNavigate={onNavigate}
                arrow={arrow}
                handleCloseSellerSubMenu={handleCloseSellerSubMenu}
            />
        );
    });

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
                handleCloseSellerSubMenu={handleCloseSellerSubMenu}
            />
        );
    });

    return (
        <div className={subMenuClassname}>
            <div
                className={cn(
                    classes.sellerSubmenuContainer,
                    // 'grid grid-cols-4'
                )}
            >
                <div
                    className={cn(
                        classes.sellerSubmenuItems,
                        'grid grid-cols-6',
                    )}
                >
                    {subMenus}
                    {shopBy}
                </div>
            </div>
        </div>
    );
};

export default SellerSubmenu;
