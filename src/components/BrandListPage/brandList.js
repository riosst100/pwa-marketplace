import React from 'react';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import BrandItem from '@riosst100/pwa-marketplace/src/components/BrandSlider/item';
import cn from 'classnames';
import Image from '@magento/venia-ui/lib/components/Image';
import bannerImage from './banner_brands.png';

const brandList = (props) => {
    const { letters, groupedBrands, active, handleActive, availableLetter } = props;

    return (
        <>
            <section className='brand_banner-container mt-6'>
                <Image
                    alt='brand-banner'
                    className="relative"
                    src={bannerImage}
                />
            </section>
            <section className='brands_list-indexing-container relative m-auto py-10'>
                <ul className='flex gap-2 justify-center flex-wrap'>
                    <li >
                        <button
                            className={cn(
                                'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                'leading-4 font-medium text-base hover_bg-gray-50'
                            )}
                            onClick={() => {
                                handleActive('all')
                            }}
                        >
                            All
                        </button>
                    </li>
                    {letters.map((letter, index) => (
                        <li key={index}>
                            <button
                                className={cn(
                                    'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                    'leading-4 font-medium text-base ',
                                    !availableLetter.includes(letter) ? 'bg-gray-100' : 'hover_bg-gray-50',
                                )}
                                onClick={() => {
                                    handleActive(letter)
                                }}
                                disabled={!availableLetter.includes(letter)}
                            >
                                {letter}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <Divider className="mb-10" />
            <section className='brand_list-container'>
                <div className='brand_list-wrapper'>
                    {availableLetter.map((initialLetter, index) => (
                        <>
                            {active === 'all' || active === initialLetter ? (
                                <div className='brand_group-wrapper mb-10' key={index}>
                                    <div className='brand_item_group_letter text-xl font-medium mb-[30px]' >
                                        {initialLetter}
                                    </div>
                                    <div
                                        className={cn(
                                            'brand_item-list grid grid-cols-2 sm_grid-cols-3 md_grid-cols-4 lg_grid-cols-5 -mx-2 lg_-mx-4 gap-y-4'
                                        )}
                                    >
                                        {groupedBrands[initialLetter].map((brand, index) => (
                                            <BrandItem
                                                key={index}
                                                name={brand.name}
                                                className="cursor-pointer"
                                                onClick={() => { alert(brand.name) }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ))}
                </div>
            </section>
        </>
    )
}

export default brandList