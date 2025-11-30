import React from 'react';
import cx from 'classnames';

const Select = (props) => {
    const {
        wrapperClassname,
        className,
        options = [],
        value,
        onChange,
        showPlaceholder = true,
        placeholder = 'Choose Option'
    } = props;

    return (
        <div className={cx('flex', wrapperClassname)}>
            <select
                className={cx('border rounded-md border-gray-100 p-2 focus-visible_outline-none', className)}
                value={value}
                onChange={onChange}
            >
                {showPlaceholder && (
                    <option value=''>
                        {placeholder}
                    </option>
                )}
                {options.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Select