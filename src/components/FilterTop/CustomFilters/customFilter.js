import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { shape, string, func } from 'prop-types';
import { X as Remove } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import defaultClasses from './customFilter.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { Link } from 'react-router-dom';

const CustomFilter = props => {
    const { group, item, onRemove } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const ariaLabel = formatMessage(
        {
            id: 'filterModal.action.clearFilterItem.ariaLabel',
            defaultMessage: 'Clear filter "{name}"'
        },
        {
            name: item.label ? item.label : item.title
        }
    );

    console.log(group)
    console.log(item)

    const normalizedData = [
        {
            'label': 'Sealed Products',
            'path': '/'
        },
        {
            'label': 'Singles',
            'path': '/'
        },
        {
            'label': 'Supplies',
            'path': '/'
        }
    ];

    const subCategory = [];

    if (group == "card_set") {
        normalizedData && normalizedData.map(({ label, path }, index) => {
            subCategory.push(
                <Link
                    key={index}
                    to={resourceUrl(path)}
                >
                    <li className={classes.item}>{label}</li>
                </Link>
            )
        });
    }


    return (
        <ul className={classes.root}>{subCategory}</ul>
        // <span className={classes.root} data-cy="CustomFilter-root">
        //     <span className={classes.text}>
        //         {item.label ? item.label : item.title}
        //     </span>
        // </span>
    );
};

export default CustomFilter;

CustomFilter.defaultProps = {
    onRemove: null
};

CustomFilter.propTypes = {
    classes: shape({
        root: string
    }),
    onRemove: func
};
