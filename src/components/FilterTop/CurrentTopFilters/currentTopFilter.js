import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { shape, string, func } from 'prop-types';
import { X as Remove } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import defaultClasses from '../FilterBlockList/filterTopItem.module.css';

const CurrentTopFilter = props => {
    const { group, item, removeItem, onRemove } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        removeItem({ group, item });
        if (typeof onRemove === 'function') {
            onRemove(group, item);
        }
    }, [group, item, removeItem, onRemove]);

    const ariaLabel = formatMessage(
        {
            id: 'filterModal.action.clearFilterItem.ariaLabel',
            defaultMessage: 'Clear filter "{name}"'
        },
        {
            name: item.label ? item.label : item.title
        }
    );

    return (
        <span className={classes.item} data-cy="CurrentTopFilter-root">
            <Trigger
                action={handleClick}
                aria-label={ariaLabel}
                data-cy="CurrentTopFilter-trigger"
            >
                All
            </Trigger>
        </span>
    );
};

export default CurrentTopFilter;