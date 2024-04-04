import React, { useMemo } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useMegaMenuItem } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenuItem';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './megaMenuItem.module.css';
import Submenu from './submenu';
import { ArrowDown2 } from 'iconsax-react';
import { textPrimary } from '@riosst100/pwa-marketplace/src/theme/vars';
import cn from 'classnames';

/**
 * The MegaMenuItem component displays mega menu item
 *
 * @param {MegaMenuCategory} props.category
 * @param {String} props.activeCategoryId - uid of active category
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const MegaMenuItem = props => {
    const {
        activeCategoryId,
        category,
        mainNavWidth,
        categoryUrlSuffix,
        subMenuState,
        disableFocus,
        onNavigate,
        handleSubMenuFocus,
        handleClickOutside,
        megaMenuItemClassname,
        titleClassName,
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const categoryUrl = resourceUrl(
        `/${category.url_path}${categoryUrlSuffix || ''}`
    );

    const talonProps = useMegaMenuItem({
        category,
        activeCategoryId,
        subMenuState,
        disableFocus
    });

    const {
        isFocused,
        isActive,
        handleMenuItemFocus,
        handleCloseSubMenu,
        isMenuActive,
        handleKeyDown
    } = talonProps;

    const itemClassName = isMenuActive
        ? classes.megaMenuItem_active
        : classes.megaMenuItem;

    const arrow = <ArrowDown2 className='ml-2 stroke-current' size="14" color={textPrimary} variant="Outline" />;

    const children = useMemo(() => {
        return category.children.length || category.name == "Lego" ? (
            <Submenu
                isFocused={isFocused}
                subMenuState={subMenuState}
                items={category.children}
                parentCategory={category}
                shopByItems={category.shop_by}
                mainNavWidth={mainNavWidth}
                handleCloseSubMenu={handleCloseSubMenu}
                categoryUrlSuffix={categoryUrlSuffix}
                onNavigate={onNavigate}
                arrow={arrow}
            />
        ) : null;
    }, [
        category,
        isFocused,
        mainNavWidth,
        subMenuState,
        handleCloseSubMenu,
        categoryUrlSuffix,
        onNavigate
    ]);

    const maybeDownArrowIcon = category.children.length || category.name == "Lego" ? (
        <ArrowDown2 className='ml-2 stroke-current' size="14" color={textPrimary} variant="Outline" />
    ) : null;

    const linkAttributes = category.children.length
        ? {
            'aria-label': `Category: ${category.name}. ${category.children.length
                } sub-categories`
        }
        : {};

    return (
        <div
            className={cn(itemClassName, megaMenuItemClassname)}
            data-cy="MegaMenu-MegaMenuItem-megaMenuItem"
            onMouseEnter={() => {
                handleSubMenuFocus();
                handleMenuItemFocus();
            }}
            onFocus={() => {
                handleSubMenuFocus();
                handleMenuItemFocus();
            }}
            onTouchStart={() => {
                handleSubMenuFocus();
                handleMenuItemFocus();
            }}
            onMouseLeave={e => {
                handleClickOutside(e);
                handleCloseSubMenu();
            }}
        >
            <Link
                {...linkAttributes}
                onKeyDown={handleKeyDown}
                className={cn(
                    isActive ? classes.megaMenuLinkActive : classes.megaMenuLink,
                    titleClassName
                )}
                data-cy="MegaMenu-MegaMenuItem-link"
                to={categoryUrl}
                onClick={onNavigate}
            >
                {category.name}
                {/* {maybeDownArrowIcon} */}
            </Link>
            {children}
        </div>
    );
};

export default MegaMenuItem;

MegaMenuItem.propTypes = {
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
    handleSubMenuFocus: PropTypes.func.isRequired,
    handleClickOutside: PropTypes.func.isRequired
};
