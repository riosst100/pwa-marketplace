import React, { useState } from 'react';
import { ArrowDown2 } from 'iconsax-react';
import cn from 'classnames';

const Collapsible = (props) => {
    const {
        rootClassName,
        expanded = false,
        children = '',
        content = '',
        title = 'title',
        contentWrapperClassName,
    } = props
    const [expand, setExpand] = useState(expanded);

    return (
        <>
            <div className={cn('w-full border-t border-gray-100', rootClassName)}>
                <div
                    className={cn(
                        'flex justify-between items-center',
                        'px-2.5 py-[18px] cursor-pointer'
                    )}
                    onClick={() => setExpand(!expand)}
                >
                    <span className='text-[16px] font-semibold'>
                        {title}
                    </span>
                    <ArrowDown2
                        className={cn(
                            'transition-all',
                            expand ? 'rotate-180' : 'rotate-0',
                        )}
                        size={16}
                    />
                </div>
                <div
                    className={cn(
                        ' transition-all mt-2.5 duration-300 ease-in-out overflow-hidden border-b border-gray-100',
                        expand ? 'h-auto opacity-100' : 'h-0 opacity-0',
                        contentWrapperClassName,
                    )}
                >
                    {children ? children : content}
                </div>
            </div>
        </>
    )
}

export default Collapsible