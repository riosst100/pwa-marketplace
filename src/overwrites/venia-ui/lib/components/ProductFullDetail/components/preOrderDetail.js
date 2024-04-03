import React from 'react';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';

const preOrderInfo = (props) => {
    const { className } = props
    return (
        <>
            <div
                className={cn(
                    'flex flex-col border border-gray-100 rounded-lg p-5 gap-2.5',
                    className
                )}
            >
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col gap-2.5'>
                        <div className='text-[14px] font-medium text-gray-500'>
                            Release Date
                        </div>
                        <div className='text-[16px] font-semibold text-colorDefault text-center'>
                            27, February 2024
                        </div>
                    </div>
                    <Divider className="w-[1px] h-[50px]" />
                    <div className='flex flex-col gap-2.5'>
                        <div className='text-[14px] font-medium text-gray-500'>
                            Last Date
                        </div>
                        <div className='text-[16px] font-semibold text-colorDefault text-center'>
                            31, March 2024
                        </div>
                    </div>
                    <Divider className="w-[1px] h-[50px]" />
                    <div className='flex flex-col gap-2.5'>
                        <div className='text-[14px] font-medium text-gray-500'>
                            Deposite
                        </div>
                        <div className='text-[16px] font-semibold text-colorDefault text-center'>
                            40%
                        </div>
                    </div>
                </div>

                <p>
                    Notes : Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh viverra non semper suscipit posuere a pede.
                </p>
            </div>
        </>
    )
}

export default preOrderInfo