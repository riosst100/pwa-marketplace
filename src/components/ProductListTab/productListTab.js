import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './productListTab.module.css';

const ProductListTab = props => {

    const classes = useStyle(defaultClasses, props.classes);

    const [activeTab, setActiveTab] = useState(null);

    let allProductClass = classes.firstButton;
    if (!activeTab) {
        allProductClass = classes.activeFirstButton;
    }

    return (
        <div className={classes.root} aria-busy="true">
            {/* <FormattedMessage
                id={'searchPage.sortContainer'}
                defaultMessage={'Items sorted by '}
            />
            <span className={classes.sortText}>
                <FormattedMessage
                    id={currentSort.sortId}
                    defaultMessage={currentSort.sortText}
                />
            </span> */}
            <nav>
                <ul className={classes.buttonContainer}>
                    <li><button className={classes.activeFirstButton}>All Products</button></li>
                    <li><button className={classes.middleButton}>Pre Order</button></li>
                    <li><button className={classes.lastButton}>Auctions</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default ProductListTab;