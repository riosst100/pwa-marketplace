import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { shape, string, func } from 'prop-types';
import { X as Remove } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import defaultClasses from './currentFilter.module.css';

const CurrentFilter = props => {
    const { group, item, removeItem, onRemove, filterNames } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

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

    const groupName = filterNames.get(group);

    return (
        <span className={classes.root} data-cy="CurrentFilter-root">
            <Trigger
                action={handleClick}
                style={{
                    "width":"30px"
                }}
                aria-label={ariaLabel}
                data-cy="CurrentFilter-trigger"
            >
                <Icon size={14} src={Remove} />
            </Trigger>
            <span className={classes.text}>
                <div style={{
                    "fontSize": "10px",
                    "color": "grey",
                    "fontWeight": "normal"
                }}>{groupName}</div>
                <div>{item.label ? item.label : item.title}</div>
            </span>
        </span>
    );
};

export default CurrentFilter;

CurrentFilter.defaultProps = {
    onRemove: null
};

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    }),
    onRemove: func
};
