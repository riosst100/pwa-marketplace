import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './shopByCategory.module.css';
import { useShopByCategory } from '@riosst100/pwa-marketplace/src/talons/ShopByCategory';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

const ShopByCategory = props => {
    const { categoryName, children, parent } = props;

    const talonProps = useShopByCategory({ children, parent });

    const {
        childrenNormalizedData,
        parentNormalizedData
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const childrenList = [];

    childrenList.push(
        <span><b>{categoryName}</b></span>
    );

    childrenNormalizedData ? childrenNormalizedData.map(({ text, path }) => {
        childrenList.push(
            <Link
                to={resourceUrl(path)}
            >
                <div>{text}</div>
            </Link>
        )
    }) : ''

    const parentList = [];
    parentNormalizedData ? parentNormalizedData.map(({ text, path }) => {
        parentList.push(
            <Link
                to={resourceUrl(path)}
            >
                <div>{text}</div>
            </Link>
        )
    }) : ''

    return (
        <aside
            className={classes.root}
            data-cy="ShopByCategory-root"
            aria-busy="false"
        >
            <br />
            <br />
            {/* <div className={classes.body}> */}
                {/* <ul> */}
                    <li>
                        <div><b>Shop By Category</b></div>
                        {parentList}
                        <ul className={classes.blocks}>{childrenList}</ul>
                    </li>
                {/* </ul> */}
            {/* </div> */}
        </aside>
    );
};

export default ShopByCategory;
