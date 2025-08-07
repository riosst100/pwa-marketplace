import React from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './sellerSubmenuColumn.module.css';
import PropTypes from 'prop-types';
import cn from 'classnames';

/**
 * The SellerSubmenuColumn component displays columns with categories in submenu
 *
 * @param {MegaMenuCategory} props.category
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const SellerSubmenuColumn = props => {
    const {
        category,
        categoryUrlSuffix,
        onNavigate,
        seller,
        handleCloseSellerSubMenu,
        arrow
    } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const categoryUrl = resourceUrl(
        '/seller/' + seller?.url_key + `/${category.url_path}${categoryUrlSuffix || ''}`
    );

    let children = null;
    let childrenItems = '';

    if (category.children.length) {
        childrenItems = category.children.map((subCategory, index) => {
            const { url_path, isActive, name } = subCategory;
            const categoryUrl = resourceUrl(
                `/${url_path}${categoryUrlSuffix || ''}`
            );

            // setting keyboardProps if it is last child of that category
            const keyboardProps =
                index === category.children.length - 1
                    ? props.keyboardProps
                    : {};

            const customMenuItems = subCategory.custom_submenu;

            let result = [];
            if (customMenuItems && customMenuItems.length) {
                customMenuItems.map((submenu, index) => {
                    const {name} = submenu;
                    result.push(
                        <li key={index} className={cn(classes.submenuChildItem, 'mt-0')}>
                            <Link
                                {...keyboardProps}
                                className={isActive ? classes.linkActive : classes.link}
                                data-cy="SellerMegaMenu-SellerSubmenuColumn-link"
                                to={categoryUrl}
                                onClick={() => {
                                    handleCloseSellerSubMenu();
                                    onNavigate();
                                }}
                            >
                                {name}
                            </Link>
                        </li>
                    )
                })
            } else {
                result.push(
                    <li key={index} className={cn(classes.submenuChildItem, 'mt-0')}>
                        <Link
                            {...keyboardProps}
                            className={isActive ? classes.linkActive : classes.link}
                            data-cy="SellerMegaMenu-SellerSubmenuColumn-link"
                            to={categoryUrl}
                            onClick={() => {
                                handleCloseSellerSubMenu();
                                onNavigate();
                            }}
                        >
                            {name}
                        </Link>
                    </li>
                );
            }

            return result;
        });
    }

    if (category.custom_submenu && category.custom_submenu.length) {
        childrenItems = category.custom_submenu.map((subCategory, index) => {
            const { path, isActive, name } = subCategory;
            const categoryUrl = resourceUrl(
                '/seller/' + seller?.url_key + `/${path}`
            );

            // setting keyboardProps if it is last child of that category
            const keyboardProps =
                index === category.children.length - 1
                    ? props.keyboardProps
                    : {};

            let result = [];

            result.push(
                <li key={index} className={cn(classes.submenuChildItem, 'mt-0')}>
                    <Link
                        {...keyboardProps}
                        className={isActive ? classes.linkActive : classes.link}
                        data-cy="SellerMegaMenu-SellerSubmenuColumn-link"
                        to={categoryUrl}
                        onClick={() => {
                            handleCloseSellerSubMenu();
                            onNavigate();
                        }}
                    >
                        {name}
                    </Link>
                </li>
            );

            return result;
        });
    }

    if (childrenItems) {
        children = <ul className={classes.submenuChild}>{childrenItems}</ul>;
    }

    // setting keyboardProps if category does not have any sub-category
    const keyboardProps = category.children.length ? {} : props.keyboardProps;

    return (
        <div className={classes.sellerSubmenuColumn}>
            <Link
                {...keyboardProps}
                className={classes.link}
                data-cy="SellerMegaMenu-SellerSubmenuColumn-link"
                to={categoryUrl}
                onClick={() => {
                    handleCloseSellerSubMenu();
                    onNavigate();
                }}
            >
                <span className={classes.heading}>{category.name}</span>
            </Link>
            {children}
        </div>
    );
};

export default SellerSubmenuColumn;

SellerSubmenuColumn.propTypes = {
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
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleCloseSellerSubMenu: PropTypes.func.isRequired
};
