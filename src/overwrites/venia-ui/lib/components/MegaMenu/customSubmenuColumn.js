import React from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './customSubmenuColumn.module.css';

const CustomSubmenuColumn = props => {
    const {
        category,
        categoryUrlSuffix,
        onNavigate,
        handleCloseSubMenu,
        customMenuItems,
        toggleCustomMenu
    } = props;
    
    const classes = useStyle(defaultClasses, props.classes);

    let children = null;

    if (customMenuItems.length) {
        const childrenItems = customMenuItems.map((submenu, index) => {
            const { name, path } = submenu;

            const categoryUrl = resourceUrl(
                `/${path}`
            );

            return (
                <li key={index} className={classes.submenuChildItem}>
                    <Link
                        className={classes.link}
                        data-cy="MegaMenu-CustomSubmenuColumn-link"
                        to={categoryUrl}
                        onClick={() => {
                            handleCloseSubMenu();
                            onNavigate();
                            toggleCustomMenu();
                        }}
                    >
                        {name}
                    </Link>
                </li>
            );
        });

        children = <ul className={classes.submenuChild}>{childrenItems}</ul>;
    }

    return children;
};

export default CustomSubmenuColumn;