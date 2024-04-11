import React, { useCallback } from 'react';
import defaultClasses from './filterTopItem.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const FilterTopItem = props => {
    const { filterApi, group, item, onApply, labels, activeFilters } = props;
    const { removeGroup, toggleItem } = filterApi;
    const { title, value } = item;

    const classes = useStyle(defaultClasses, props.classes);

    const label = item.label ? item.label : item.title;

    const handleOnchange = useCallback(
        e => {
            if (group != "category_uid") {
                removeGroup({ group });
                if (e === item.value) {
                    toggleItem({ group, item });
                }
            }
            if (typeof onApply === 'function') {
                onApply(group, item);
            }
        },
        [group, item, onApply, removeGroup, toggleItem]
    );

    const element = activeFilters.includes(value) ? (
        <span className={classes.item}><b>{title}</b></span>
    ) : (
        <span className={classes.item} onClick={() =>handleOnchange(value)}>{title}</span>
    )

    labels.set(element, label);

    return element;
};

export default FilterTopItem;
