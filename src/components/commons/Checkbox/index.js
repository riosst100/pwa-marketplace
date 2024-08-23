import React, { useState } from 'react';
import cn from 'classnames';

const Checkbox = (props) => {
    const {
        onChange = () => { },
        className = '',
        id = '',
        defaultChecked = false,
        width = 20,
        height = 20,
        color = '#4E31DB',
        colorUncheked = '#E6E9EA'
    } = props;

    const [checked, setChecked] = useState(defaultChecked);

    const handleChange = (e) => {
        if (e.target.checked) {
            setChecked(true);
        } else {
            setChecked(false);
        }
        onChange(e);
    }

    return (
        <>
            <div className={cn('relative', className)}>
                {checked ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width + 4} ${height + 4}`} fill="none">
                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width + 4} ${height + 4}`} fill="none">
                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke={colorUncheked} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </>
                )}
                <input
                    type="checkbox"
                    onChange={(e) => handleChange(e)}
                    className='opacity-0 absolute top-0'
                    checked={checked}
                    style={{ width: width, height: height }}
                    id={id}
                />
            </div>
        </>
    )
}

export default Checkbox