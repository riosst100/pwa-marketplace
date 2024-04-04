import { useSubCategory } from '@riosst100/pwa-marketplace/src/talons/SubCategory/useSubCategory';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './subCategory.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar';
import CollectibleGameSets from '@riosst100/pwa-marketplace/src/components/CollectibleGameSets/collectibleGameSets';

const SubCategory = props => {
    // const { children } = props;

    // const talonProps = useSubCategory({ children });

    const classes = useStyle(defaultClasses, props.classes);

    const [activeTab, setActiveTab] = useState('singles')

    return (
        <>
            <ul className={classes.root}>
                <li className={classes.item} onClick={() => setActiveTab('singles')}>All Sets</li>
                <li className={classes.item} onClick={() => setActiveTab('sealed-products')}>Expansion Sets</li>
            </ul>
            {activeTab == "singles" ? <CollectibleGameSets product_type={"singles"} /> : <CollectibleGameSets product_type={"sealed-products"} />}
        </>
    )
};

export default SubCategory;