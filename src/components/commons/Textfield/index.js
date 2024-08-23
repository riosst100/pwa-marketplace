import React from 'react';
import cx from 'classnames';

const index = (props) => {
    const {
        wrapperClassname,
        className,
        value
    } = props;
    return (
        <div className={cx('flex', wrapperClassname)}>
            <input
                className={cx('w-full p-2 border border-gray-100 rounded-md focus-visible_outline-none', className)}
                value={value}
            />
        </div>
    )
}

export default index