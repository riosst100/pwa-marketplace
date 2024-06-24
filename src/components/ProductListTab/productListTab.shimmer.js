import React from 'react';
import { shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import defaultClasses from './productListTab.module.css';

const ProductListTabShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer width={10} />
        </div>
    );
};

ProductListTabShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default ProductListTabShimmer;
