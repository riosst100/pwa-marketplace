import React from 'react';
import cn from 'classnames';

const Divider = (props) => {
    const { className } = props
    return (
        <div className={cn('w-full h-[1px] bg-gray-100', className)} />
    )
}

export default Divider