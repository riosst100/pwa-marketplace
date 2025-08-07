import React, { useMemo } from 'react';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';

const preOrderInfo = (props) => {
    const { className, productDetails } = props

    const preorderData = productDetails ? productDetails.preorder : null;
    
    const isPreOrder = preorderData && preorderData.is_preorder ? true : false;
    const preOrderNotes = preorderData ? preorderData.preorder_notes : null;
    const preOrderAvailableDate = preorderData ? new Date(preorderData.preorder_availability) : null;

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    return isPreOrder ? (
        <>
            <div
                className={cn(
                    'flex flex-col border border-gray-100 rounded-lg p-5 gap-2.5',
                    className
                )}
            >
                <div className='flex flex-row justify-between gap-[20px]'>
                    <div className='flex flex-col gap-2.5'>
                        <div className='text-[14px] font-medium text-gray-500'>
                            Release Date
                        </div>
                        <div className='text-[16px] font-medium text-colorDefault text-center'>
                            {preOrderAvailableDate ? preOrderAvailableDate.getDate() + ', ' + month[preOrderAvailableDate.getMonth()] + ' ' + preOrderAvailableDate.getFullYear() : 'No Release Date.'}
                            {/* 27, February 2024 */}
                        </div>
                    </div>
                    <Divider className="w-[1px] h-[50px]" />
                    <div className='flex flex-col gap-2.5'>
                        <div className='text-[14px] font-medium text-gray-500'>
                            Last Date
                        </div>
                        <div className='text-[16px] font-medium text-colorDefault text-center'>
                            31, March 2024
                        </div>
                    </div>
                    <Divider className="w-[1px] h-[50px]" />
                    <div className='flex flex-col gap-2.5'>
                        <div className='text-[14px] font-medium text-gray-500'>
                            Deposite
                        </div>
                        <div className='text-[16px] font-medium text-colorDefault text-center'>
                            40%
                        </div>
                    </div>
                </div>
                {preOrderNotes && <p>
                    Notes : {preOrderNotes}
                </p>}
            </div>
        </>
    ) : ''
}

export default preOrderInfo