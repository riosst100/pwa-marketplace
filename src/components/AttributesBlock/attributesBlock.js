import { useAttributesBlock } from '@riosst100/pwa-marketplace/src/talons/AttributesBlock/useAttributesBlock';
import React from 'react';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './attributesBlock.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const AttributesBlock = props => {
    const { attributesBlock, category } = props;

    const talonProps = useAttributesBlock({ attributesBlock });

    const classes = useStyle(defaultClasses, props.classes);

    const {
        categoryUrlSuffix,
        getPath
    } = talonProps;
    
    const result = [];
    
    attributesBlock && attributesBlock.map(({ label, code, items }, index) => {

        const itemsResult = [];

        items && items.map(({ label, value }, index) => {
            const path = resourceUrl(
                `/${category.url_path}${categoryUrlSuffix || ''}?${code}[filter]=${label},${value}`
            );

            itemsResult.push(
                <>
                    <Link
                            key={index}
                            to={path}
                        >
                        <li className={classes.item}>{label}</li>
                    </Link>
                </>
            )
        });

        result.push(
            <span key={index}>
                <div className={classes.title}>{label}</div>
                <ul className={classes.root}>{itemsResult}</ul>
            </span>
        )
    });

    return result;
};

export default AttributesBlock;