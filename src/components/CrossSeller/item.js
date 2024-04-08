import React from 'react';
import { Form } from 'informed';
import Button from '@magento/venia-ui/lib/components/Button';
import Image from '@magento/venia-ui/lib/components/Image';
import QuantityStepper from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/QuantityStepper';
import Verify from './verifyIcon';
import Star from './starIcon';
import logoImage from './logo_seller.png';

const item = () => {
    return (
        <>
            <div className='flex flex-col gap-y-4 lg_flex-row justify-between bg-white rounded-lg border border-gray-100 p-[15px]'>
                <div className='seller_info-container flex flex-row gap-x-[15px]'>
                    <div className='logo_wrapper w-[100px] h-[100px]'>
                        <Image
                            alt='seller name'
                            className="relative mt-[-5px]"
                            src={logoImage}
                        />
                    </div>
                    <div className='flex flex-col gap-y-[15px]'>
                        <div className='seller_summary-wrapper flex flex-row gap-x-2.5 items-center'>
                            <div className='seller_name text-lg font-semibold leading-6'>
                                Zen Market
                            </div>
                            <div className='seller_badge flex flex-row gap-x-[5px] items-center leading-6'>
                                <Verify />
                                <span className='text-xs font-medium text-gray-600-transparent capitalize'>
                                    Verified
                                </span>
                            </div>
                        </div>
                        <div className='rating_sales flex flex-row gap-x-[5px] items-center'>
                            <Star />
                            <span className='font-normal text-[14px] text-gray-200'>
                                4.7 (Sales 120)
                            </span>
                        </div>
                    </div>
                </div>

                <div className='price_container'>
                    <div className='price text-lg font-semibold'>
                        $34.19
                    </div>
                    <span className='shipping_note text-xs text-gray-200'>
                        Shipping method is calculated on checkout
                    </span>
                </div>

                <div className='form_wrapper'>
                    <Form
                        data-cy="FormAddToCartCrossSeller"
                        onSubmit={() => { }}
                        className="flex flex-row gap-x-7"
                    >
                        <QuantityStepper
                            min={1}
                        // message={'error quantity'}
                        />
                        <Button
                            data-cy="addToCartButton"
                            classes={{
                                content: 'normal-case font-semibold text-[16px]'
                            }}
                            priority="high"
                            type="button"
                        >
                            Add To Cart
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default item