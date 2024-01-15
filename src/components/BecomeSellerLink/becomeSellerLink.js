import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './becomeSellerLink.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';

const BecomeSellerLink = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const becomeSellerLabel = "Become a Seller";

    return (
        <div className={classes.root} data-cy="BecomeSellerLink-root">
            <Link
                aria-label={becomeSellerLabel}
                to={resourceUrl('/become-seller')}
            >{becomeSellerLabel}</Link>
        </div>
    );
};

export default BecomeSellerLink;

BecomeSellerLink.propTypes = {
    classes: shape({
        root: string
    })
};
