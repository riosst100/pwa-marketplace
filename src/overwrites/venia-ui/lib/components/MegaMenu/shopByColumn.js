import React from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './shopByColumn.module.css';
import PropTypes from 'prop-types';

const ShopByColumn = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        shopBy
    } = props;

    // const categoryUrl = resourceUrl(
    //     `/${category.url_path}${categoryUrlSuffix || ''}`
    // );
    let items = null;

    if (shopBy.items.length) {
        const childrenItems = shopBy.items.map((shopByItem, index) => {
    //         const { url_path, isActive, name } = shopByItem;
            const { name } = shopByItem;
    //         const categoryUrl = resourceUrl(
    //             `/${url_path}${categoryUrlSuffix || ''}`
    //         );

            // setting keyboardProps if it is last child of that shopBy
            const keyboardProps =
                index === shopBy.items.length - 1
                    ? props.keyboardProps
                    : {};

            return (
                <li key={index} className={classes.submenuChildItem}>
                    <Link
                        {...keyboardProps}
                        // className={isActive ? classes.linkActive : classes.link}
                        className={classes.link}
                        data-cy="MegaMenu-ShopByColumn-link"
                        // to={categoryUrl}
                        // onClick={onNavigate}
                    >
                        {name}
                    </Link>
                </li>
            );
        });

        items = <ul className={classes.submenuChild}>{childrenItems}</ul>;
    }

    return (
        <div className={classes.ShopByColumn}>
            {/* <Link
                {...keyboardProps}
                className={classes.link}
                data-cy="MegaMenu-ShopByColumn-link"
                to={categoryUrl}
                onClick={() => {
                    handleCloseSubMenu();
                    onNavigate();
                }}
            >
                <span className={classes.heading}>{category.name}</span>
            </Link> */}
            <span className={classes.heading}>{shopBy.name}</span>
            {items}
        </div>
    );
};

export default ShopByColumn;