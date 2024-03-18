import React, { useCallback } from 'react';
import { bool, func, number, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Pagination/tile.module.css';
import cn from 'classnames';

const Tile = props => {
    const { isActive, number, onClick } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isActive ? classes.root_active : classes.root;
    const handleClick = useCallback(() => onClick(number), [onClick, number]);

    return (
        <button
            className={cn(
                rootClass,
                isActive ? 'bg-blue-600 !border-blue-600' : 'bg-white',
                'border-[1px] border-gray-100 rounded-[5px] !min-h-auto h-fit min-w-[40px] px-[10px] py-[7px]'
            )}
            onClick={handleClick}
            data-cy={isActive ? 'Tile-activeRoot' : 'Tile-root'}
        >
            <span className={cn(isActive ? '!text-white' : 'text-blue-600', 'text-base leading-[16px]')}>
                {number}
            </span>
        </button>
    );
};

Tile.propTypes = {
    classes: shape({
        root: string,
        root_active: string
    }),
    isActive: bool,
    number: number,
    onClick: func
};

export default Tile;
