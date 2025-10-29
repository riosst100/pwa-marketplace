import { useSubCategory } from '@riosst100/pwa-marketplace/src/talons/SubCategory/useSubCategory';
import React from 'react';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './subCategory.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const SubCategory = props => {
    const { children, parent } = props;

    const talonProps = useSubCategory({ children });

    const classes = useStyle(defaultClasses, props.classes);

    const {
        normalizedData
    } = talonProps;

    const maxSubCategory = 10;
    
    const subCategory = [];
    
    normalizedData && normalizedData.length && normalizedData.map(({ text, path }, index) => {
        if (index < maxSubCategory) {
            const isActive = index == 0 ? true : false;

            const item = isActive ? (
                <span className={classes.item}><b>{text}</b></span>
            ) : (
                <Link
                    key={index}
                    to={resourceUrl(path)}
                >
                    <li className={classes.item}>{text}</li>
                </Link>
            );

            subCategory.push(item)
        }
    });

    if (normalizedData.length > maxSubCategory) {
        subCategory.push(
            <Link
                to={resourceUrl('?show_subcategory=1')}
            >
                <li className={classes.item}>{"More " + parent[0].name}</li>
            </Link>
        )
    }

    return subCategory.length ? <ul className={classes.root}>{subCategory}</ul> : '';
};

export default SubCategory;