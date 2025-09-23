import React from 'react';
import cn from 'classnames';

const Item = (props) => {
    const {
        name = 'Tamashii Nations', rootClassName, onClick = () => { },
        className = "",
    } = props;

    const initialName = (name) => {
        if (!name) return ""; // Handle empty names

        const words = name.split(" ");
        let initials = "";

        for (const word of words) {
            initials += word.charAt(0).toUpperCase();
        }

        return initials;
    }
    return (
        <div className={cn('brand-item-container px-2 lg_px-4', rootClassName)} onClick={onClick}>
            <div
                className={cn(
                    'm-auto flex flex-col',
                    'w-full max-w-[250px]',
                    'relative rounded-lg border border-gray-100 bg-white',
                    className,
                )}
            >
                <div className="brand_logo-wrapper w-full min-h-[120px] rounded-t-lg">

                </div>
                <div
                    className={cn(
                        'bg-darkblue-900 text-white uppercase text-lg font-bold leading-5 absolute min-w-[60px] text-center',
                        'p-5 rounded-md top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'
                    )}
                >
                    {initialName(name)}
                </div>
                <div className='brand_name-wrapper flex items-center justify-center w-full min-h-[110px]'>
                    <span className='text-base font-medium'>
                        {name}
                    </span>
                </div>
                <style global jsx>
                    {`
                        .brand_logo-wrapper {
                            background: rgb(217, 217, 217);
                            background: linear-gradient(180deg, rgb(217, 217, 217) 0%, rgba(217, 217, 217, 0) 100%);
                        }
                    `}
                </style>
            </div>
        </div>
    )
}

export default Item;