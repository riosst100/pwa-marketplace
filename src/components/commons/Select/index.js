import React from 'react';
import cx from 'classnames';

const Select = (props) => {
    const {
        wrapperClassname,
        className,
        options = []
    } = props;

    return (
        <div className={cx('flex', wrapperClassname)}>
            <select
                className={cx('border rounded-md border-gray-100 p-2 focus-visible_outline-none', className)}
            >
                <option value=''>
                    Choose Option
                </option>
                {options.map((item) => (
                    <option value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Select