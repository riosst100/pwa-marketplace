import React, { useMemo } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useSellerMegaMenuItem } from '@riosst100/pwa-marketplace/src/talons/SellerMegaMenu/useSellerMegaMenuItem';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './sellerMegaMenuItem.module.css';
import SellerSubmenu from './sellerSubmenu';
import { ArrowDown2 } from 'iconsax-react';
import { textPrimary } from '@riosst100/pwa-marketplace/src/theme/vars';
import cn from 'classnames';

/**
 * The SellerMegaMenuItem component displays mega menu item
 *
 * @param {MegaMenuCategory} props.category
 * @param {String} props.activeCategoryId - uid of active category
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const SellerMegaMenuItem = props => {
    const {
        activeCategoryId,
        category,
        mainNavWidth,
        categoryUrlSuffix,
        sellerSubMenuState,
        seller,
        disableFocus,
        onNavigate,
        handleSellerSubMenuFocus,
        handleClickOutside,
        sellerMegaMenuItemClassname,
        titleClassName,
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const categoryUrl = resourceUrl(
        `/${category.url_path}${categoryUrlSuffix || ''}`
    );

    const talonProps = useSellerMegaMenuItem({
        category,
        activeCategoryId,
        sellerSubMenuState,
        disableFocus
    });

    const {
        isFocused,
        isActive,
        handleMenuItemFocus,
        handleCloseSellerSubMenu,
        isMenuActive,
        handleKeyDown
    } = talonProps;

    const itemClassName = isMenuActive
        ? classes.sellerMegaMenuItem_active
        : classes.sellerMegaMenuItem;

    const arrow = <ArrowDown2 className='ml-2 stroke-current' size="14" color={textPrimary} variant="Outline" />;

    const children = useMemo(() => {
        return category.children.length || category.name == "Lego" ? (
            <SellerSubmenu
                isFocused={isFocused}
                sellerSubMenuState={sellerSubMenuState}
                items={category.children}
                seller={seller}
                parentCategory={category}
                shopByItems={category.shop_by}
                mainNavWidth={mainNavWidth}
                handleCloseSellerSubMenu={handleCloseSellerSubMenu}
                categoryUrlSuffix={categoryUrlSuffix}
                onNavigate={onNavigate}
                arrow={arrow}
            />
        ) : null;
    }, [
        category,
        isFocused,
        mainNavWidth,
        sellerSubMenuState,
        handleCloseSellerSubMenu,
        categoryUrlSuffix,
        onNavigate
    ]);
    
    const maybeDownArrowIcon = category.children.length ? (
        <ArrowDown2 className='ml-2' size={12} color={textPrimary} variant="Outline" />
    ) : null;

    const linkAttributes = category.children.length
        ? {
            'aria-label': `Category: ${category.name}. ${category.children.length
                } sub-categories`
        }
        : {};

    return category.name != 'Auction' && (
        <div
            className={cn(itemClassName, sellerMegaMenuItemClassname)}
            data-cy="SellerMegaMenu-SellerMegaMenuItem-sellerMegaMenuItem"
            onMouseEnter={() => {
                handleSellerSubMenuFocus();
                handleMenuItemFocus();
            }}
            onFocus={() => {
                handleSellerSubMenuFocus();
                handleMenuItemFocus();
            }}
            onTouchStart={() => {
                handleSellerSubMenuFocus();
                handleMenuItemFocus();
            }}
            onMouseLeave={e => {
                handleClickOutside(e);
                handleCloseSellerSubMenu();
            }}
        >
            <Link
                {...linkAttributes}
                onKeyDown={handleKeyDown}
                className={cn(
                    isActive ? classes.sellerMegaMenuLinkActive : classes.sellerMegaMenuLink,
                    titleClassName,
                    'flex items-center'
                )}
                data-cy="SellerMegaMenu-SellerMegaMenuItem-link"
                to={'/seller/' + seller?.url_key + categoryUrl}
                onClick={onNavigate}
            >
                {category.name}
                {/* {maybeDownArrowIcon} */}
            </Link>
            {children}
        </div>
    );
};

export default SellerMegaMenuItem;

SellerMegaMenuItem.propTypes = {
    category: PropTypes.shape({
        children: PropTypes.array,
        uid: PropTypes.string.isRequired,
        include_in_menu: PropTypes.number,
        isActive: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.array.isRequired,
        position: PropTypes.number.isRequired,
        url_path: PropTypes.string.isRequired
    }).isRequired,
    activeCategoryId: PropTypes.string,
    mainNavWidth: PropTypes.number.isRequired,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleSellerSubMenuFocus: PropTypes.func.isRequired,
    handleClickOutside: PropTypes.func.isRequired
};
