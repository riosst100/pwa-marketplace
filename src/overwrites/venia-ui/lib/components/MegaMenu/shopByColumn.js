import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './submenuColumn.module.css';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import cn from 'classnames';

const ShopByColumn = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const {
        shopBy,
        category,
        categoryUrlSuffix,
        handleCloseSubMenu,
        onNavigate
    } = props;

    const { url_path } = category;

    let items = null;

    const itemCountToShow = 9999;

    if (shopBy.items.length) {
        const childrenItems = shopBy.items.map((shopByItem, index) => {

            if (index >= itemCountToShow) {
                return null;
            }

            const { name, option_id } = shopByItem;
    //         const categoryUrl = resourceUrl(
    //             `/${url_path}${categoryUrlSuffix || ''}`
    //         );

            // setting keyboardProps if it is last child of that shopBy
            const keyboardProps =
                index === shopBy.items.length - 1
                    ? props.keyboardProps
                    : {};

            const categoryUrl = 
                `/${shopByItem.url_path}`
            ;

            return (
                <li key={index} className={cn(classes.submenuChildItem, 'mt-4')}>
                    <Link
                        {...keyboardProps}
                        // className={isActive ? classes.linkActive : classes.link}
                        className={classes.link}
                        data-cy="MegaMenu-ShopByColumn-link"
                        to={categoryUrl}
                        onClick={() => {
                            handleCloseSubMenu();
                            onNavigate();
                        }}
                    >
                        {name}
                    </Link>
                </li>
            );
        });

        items = <ul className={classes.submenuChild}>{childrenItems}</ul>;
    }

    const viewAll = useMemo(() => {
        if (shopBy.items.length <= itemCountToShow) {
            return null;
        }

        const label = formatMessage({
            id: 'filterList.viewAll',
            defaultMessage: 'View All'
        });

        const categoryUrl = resourceUrl(
            `/shop/${shopBy.code}`
        );

        return (
            <li className={classes.submenuChildItem}>
                <Link
                    // className={isActive ? classes.linkActive : classes.link}
                    className={classes.link}
                    data-cy="MegaMenu-ShopByColumn-link"
                    to={categoryUrl}
                    onClick={handleCloseSubMenu}
                >
                    {label}
                </Link>
            </li>
        );
    }, [
        // handleViewAll,
        shopBy,
        itemCountToShow,
        formatMessage,
        // classes
    ]);

    return (
        <div className={classes.submenuItems}>
            <div className={classes.submenuColumn}>
                <span className={classes.heading}>{shopBy.name}</span>
                {items}
                {viewAll}
            </div>
        </div>
    );
};

export default ShopByColumn;