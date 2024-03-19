import React, { useCallback } from 'react';
import { Check } from 'react-feather';
import { bool, func, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './sortItem.module.css';
import cn from 'classnames';

const SortItem = props => {
    const { active, onClick, sortItem } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(
        e => {
            // use only left click for selection
            if (e.button === 0) {
                onClick(sortItem);
            }
        },
        [sortItem, onClick]
    );

    const handleKeyDown = useCallback(
        e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(sortItem);
            }
        },
        [onClick, sortItem]
    );

    return (
        <button
            className={cn(classes.root, active ? `before_block before_h-[100%] before_w-[3px] before_bg-blue-700 before_left-[-10px] before_absolute` : '')}
            data-cy={active ? 'SortItem-activeButton' : 'SortItem-button'}
            onMouseDown={handleClick}
            onKeyDown={handleKeyDown}
        >
            <span className={classes.content}>
                <span className={classes.text}>{sortItem.text}</span>
            </span>
        </button>
    );
};

SortItem.propTypes = {
    active: bool,
    classes: shape({
        content: string,
        root: string,
        text: string
    }),
    onClick: func
};

export default SortItem;
