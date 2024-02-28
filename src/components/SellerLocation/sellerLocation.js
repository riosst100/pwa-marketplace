import React from 'react';
import SellerLocationItem from './sellerLocationItem';

const SellerLocation = ({ storeLocators }) => {
    return (
        <>{storeLocators.length > 0 ? (
            <div class="w-full flex flex-col items-start gap-[25px]">
                <div class="relative w-fit font-semibold  text-[20px] tracking-[0] leading-[normal]">Our Store</div>
                <div class="w-full grid xs_grid-cols-1 md_grid-cols-2 xl_grid-cols-3 gap-4">
                    {storeLocators && storeLocators.map((value, index) =>
                        <SellerLocationItem storeLocator={value} key={index} />
                    )}
                </div>
            </div>
        ) : ''}
        </>
    )
}

export default SellerLocation;