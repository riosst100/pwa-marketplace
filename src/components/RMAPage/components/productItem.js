import React, { useState } from 'react';
import Image from '@magento/venia-ui/lib/components/Image';
import { Link } from 'react-router-dom';
import Select from '@riosst100/pwa-marketplace/src/components/commons/Select';
import TextField from '@riosst100/pwa-marketplace/src/components/commons/Textfield';
import Checkbox from '@riosst100/pwa-marketplace/src/components/commons/Checkbox';

const productItem = (props) => {
    const { withCheckbox = false } = props
    const urlImage = 'https://pwa-tcgcollective.local:8255/media/catalog/product/s/-/s-l1600_6__1.jpg?auto=webp&format=pjpg&width=495&height=618.75&fit=cover';
    const reasonOptions = [
        {
            value: 0,
            label: 'Out of Service'
        }
    ]

    const [show, setShow] = useState(false);

    const handleChange = (e) => {
        const checked = e.target.checked;
        setShow(checked)
    }

    return (
        <>
            <div className='item flex flex-col lg_flex-row justify-between border border-gray-100 rounded-md p-4'>
                <div className='flex gap-4 w-full lg_w-3/5'>
                    {withCheckbox ? (
                        <Checkbox onChange={(e) => handleChange(e)} />
                    ) : null}

                    <div className='flex w-full gap-4'>
                        <div className='block'>
                            <Image
                                alt='product image'
                                className="relative max-w-[120px]"
                                src={urlImage}
                                classes={{
                                    root: ' relative self-center mb-5'
                                }}
                            />
                        </div>
                        <div className='flex flex-col gap-y-1 w-full md_w-6/12'>
                            <div className='block'>
                                <p className='text-[13px] text-colorDefault flex justify-between'>
                                    <span className='font-medium block'>
                                        BANPRESTO DEMON SLAYER: KIMETSU NO YAIBA: GIYU TOMIOKA - FIGURE
                                    </span>
                                </p>
                            </div>
                            <div className='block'>
                                <p className='text-[13px] text-gray-200 flex justify-between'>
                                    <span className='font-normal block'>
                                        Qty : 3
                                    </span>
                                </p>
                            </div>
                            <div className='block'>
                                <p className='text-[13px] text-gray-200 flex justify-between'>
                                    <span className='font-normal block'>
                                        SGD 16
                                    </span>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='block w-full lg_w-2/5'>
                    {show ? (
                        <>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Qty Return
                                </p>
                                <TextField />
                            </div>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Return Reason
                                </p>
                                <Select
                                    options={reasonOptions}
                                    className='w-full'
                                />
                            </div>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Item Condition
                                </p>
                                <Select
                                    options={reasonOptions}
                                    className='w-full'
                                />
                            </div>
                            <div className='flex flex-col mb-2.5'>
                                <p className='mb-1'>
                                    Resolution
                                </p>
                                <Select
                                    options={reasonOptions}
                                    className='w-full'
                                />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default productItem