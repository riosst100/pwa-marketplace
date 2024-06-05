import { useCustomSubCategory } from '@riosst100/pwa-marketplace/src/talons/SubCategory/useCustomSubCategory';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './customSubCategory.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const CustomSubCategory = props => {
    const { customSubCategory, categoryName } = props;

    const talonProps = useCustomSubCategory({ customSubCategory });

    const classes = useStyle(defaultClasses, props.classes);

    const {
        normalizedData
    } = talonProps;
    
    const subCategory = [];
    
    normalizedData && normalizedData.map(({ text, path }, index) => {
        if (text == categoryName) {
            subCategory.push(
                <span>
                    <b>
                        <li className={classes.item}>{text}</li>
                    </b>
                </span>
            )
        } else {
            subCategory.push(
                <Link
                    key={index}
                    to={resourceUrl(path)}
                >
                    <li className={classes.item}>{text}</li>
                </Link>
            )
        }
    });

    return subCategory.length ? <ul className={classes.root}>{subCategory}</ul> : '';
};

export default CustomSubCategory;