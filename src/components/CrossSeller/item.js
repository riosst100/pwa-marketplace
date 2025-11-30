import React from 'react';
import { Form } from 'informed';
import Button from '@magento/venia-ui/lib/components/Button';
import Image from '@magento/venia-ui/lib/components/Image';
import QuantityStepper from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/QuantityStepper';
import Verify from './verifyIcon';
import Star from './starIcon';
import logoImage from './logo_seller.png';

const Item = ({ sellerName, sales, price, condition }) => {
    return (
        <div className='flex flex-col items-center text-center justify-around lg_text-left md_text-left lg_flex-row md_flex-row bg-white rounded-lg border border-gray-100 p-[15px] gap-y-4'>
            <div className='seller_info-container flex flex-row gap-x-[15px] lg_w-1/3 md_w-1/3'>
                <div className='flex flex-col gap-y-[15px]'>
                    <div className='seller_summary-wrapper flex flex-row gap-x-2.5 items-center'>
                        <div className='seller_name text-lg font-semibold leading-6'>
                            {sellerName}
                        </div>
                    </div>
                    <div className='rating_sales flex flex-row gap-x-[5px] items-center'>
                        <span className='font-normal text-[14px] text-gray-200'>
                            {sales}+ Sales
                        </span>
                    </div>
                </div>
            </div>

            <div className='price_container lg_w-1/3 md_w-1/3'>
                <div className="text-sm font-medium text-gray-800">{condition}</div>
                <div className='price text-lg font-medium text-[#f76b1c]'>
                    ${price}
                </div>
                <span className='shipping_note text-xs text-gray-200'>
                    Shipping method is calculated on checkout
                </span>
            </div>

            <div className='form_wrapper'>
                <Form
                    data-cy="FormAddToCartCrossSeller"
                    onSubmit={() => { }}
                    className="flex flex-col gap-x-7 gap-y-7 items-center lg_flex-row md_flex-row"
                >
                    <Button
                        data-cy="viewProductButton"
                        classes={{
                            content: 'normal-case font-medium text-[16px]'
                        }}
                        priority="high"
                        type="button"
                    >
                        View Product
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Item;
