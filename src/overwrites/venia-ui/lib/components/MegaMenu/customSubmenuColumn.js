import React from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './customSubmenuColumn.module.css';
import cn from 'classnames';

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
                <li key={index} className={cn(classes.submenuChildItem, 'mt-1')}>
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

        children = <>
        <ul className={cn(classes.submenuChild, 'pt-1')}><span className={classes.heading}>Categories</span>{childrenItems}</ul>
        </>;
    }

    return children;
    // return (
    //     <div className={classes.submenuColumn}>
    //         <Link
    //             // {...keyboardProps}
    //             className={classes.link}
    //             data-cy="MegaMenu-SubmenuColumn-link"
    //             // to={categoryUrl}
    //             // onClick={() => {
    //                 // handleCloseSubMenu();
    //                 // onNavigate();
    //             // }}
    //         >
    //             <span className={classes.heading}>{category.name}</span>
    //         </Link>
    //         {children}
    //     </div>
    // );
};

export default CustomSubmenuColumn;