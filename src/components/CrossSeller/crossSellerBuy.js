// crossSellerBuy.js
import React from 'react';
import Item from './item';

export const listings = [
    { id: 1, sellerName: 'SuperGamesInc', sales: 3329, condition: 'Near Mint 1st Edition', price: 34.19 },
    { id: 2, sellerName: 'GameWorld', sales: 1520, condition: 'Near Mint 1st Edition', price: 28.49 },
    { id: 3, sellerName: 'MegaPlay', sales: 980, condition: 'Near Mint 1st Edition', price: 31.00 }
];

export const totalListings = listings.length;
export const lowestPrice = Math.min(...listings.map(item => item.price));

const CrossSellerBuy = () => {
    return (
        <>
            <h3 className="font-semibold text-sm sm_text-base md_text-lg lg_text-xl xl_text-2xl mb-1">{totalListings} Listings</h3>
            <p className="text-[16px] mb-6">As low as ${lowestPrice.toFixed(2)}</p>

            <div className="flex flex-col gap-y-4">
                {listings.map(item => (
                    <Item key={item.id} {...item} />
                ))}
            </div>
        </>
    );
};

export default CrossSellerBuy;
