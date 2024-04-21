import React from 'react';
import Slider from "react-slick";
import GalleryItem from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Gallery/item';
import { useCarousel } from './useCarousel';

const Carousel = props => {
    const { settings, items } = props;
    const { storeConfig } = useCarousel();

    const galleryItems = items.map((item, index) => {
        return (
            <GalleryItem key={index} item={item} storeConfig={storeConfig} rootClassName="px-2 block product-item max-w-[240px]" />
        );
    });

    return (
        <>
            <Slider {...settings} className='product-carousel -mx-2'>
                {galleryItems}
            </Slider>
            <style global jsx>
                {`
                    .product-carousel .slick-slide a {
                        text-decoration: none !important;
                    }
                    // article[class*="cms-root"] {
                    //     padding: 0;
                    // }
                    .product-carousel .item-product img {
                        margin: 0 !important;
                    }
                `}
            </style>
        </>
    );
};

export default Carousel;
