import React, { useState } from 'react';
import { ArrowDown2 } from 'iconsax-react';
import cn from 'classnames';

const bidList = (props) => {
    const {
        rootClassName,
        expanded = false,
    } = props
    const [expand, setExpand] = useState(expanded);

    return (
        <>
            <div className={cn('bid_list-container w-full', rootClassName)}>
                <div
                    className={cn(
                        'bid_title flex justify-between items-center border-t border-b border-gray-100',
                        'px-2.5 py-[18px] cursor-pointer'
                    )}
                    onClick={() => setExpand(!expand)}
                >
                    <span className='text-[16px] font-medium'>
                        Previous bids (5)
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
                        'bid_list-wrapper transition-all mt-2.5 duration-300 ease-in-out overflow-hidden',
                        'max-h-[250px] overflow-y-auto',
                        expand ? 'h-auto opacity-100' : 'h-0 opacity-0'
                    )}
                >
                    <table className='bid_list w-full' >
                        {[...Array(5)].map(() => (
                            <tr className='border-b border-dashed border-gray-100'>
                                <td className='p-2.5'>
                                    <span className='text-[14px] font-medium'>
                                        $102.00
                                    </span>
                                </td>
                                <td className='p-2.5'>
                                    <span className='text-[14px] font-medium'>
                                        Jan 7, 2024 11:18:08 AM
                                    </span>
                                </td>
                                <td className='p-2.5'>
                                    <span className='text-[14px] font-medium'>
                                        by Ale****
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        </>
    )
}

export default bidList