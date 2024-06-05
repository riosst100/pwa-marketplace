import { useSubCategory } from '@riosst100/pwa-marketplace/src/talons/SubCategory/useSubCategory';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import defaultClasses from './subCategory.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const SubCategory = props => {
    const { children } = props;

    const talonProps = useSubCategory({ children });

    const classes = useStyle(defaultClasses, props.classes);

    const {
        normalizedData
    } = talonProps;
    
    const subCategory = [];
    
    if (normalizedData && normalizedData.length) {
        normalizedData.map(({ text, path }, index) => {
            subCategory.push(
                <Link
                    key={index}
                    to={path}
                >
                    <li className={classes.item}>{text}</li>
                </Link>
            )
        });
    }

    return subCategory.length ? <ul className={classes.root}>{subCategory}</ul> : '';
};

export default SubCategory;