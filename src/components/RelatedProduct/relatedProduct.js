import React from 'react';
import GalleryItem from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Gallery/item';
import Slider from "react-slick";
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import cn from 'classnames';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';

import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';

const CustomArrow = (props) => {
    const { isNext = true, onClick, className } = props;
    return (
        <span
            className={cn(
                className,
                'custom_arrow rounded-full w-10 h-10 p-2.5 bg-white hover_!bg-white z-[1] !border !border-solid !border-gray-100 before_hidden',
                isNext ? 'right-2 lg_right-4' : 'left-2 lg_left-4',
            )}
            onClick={onClick}
        >
            {isNext ? (
                <ArrowRight2 className='' size="20" color={primary900} />
            ) : (
                <ArrowLeft2 size="20" color={primary900} />
            )}
        </span>
    )
}

const relatedProduct = (props) => {
    const { data } = props;
    const talonProps = useGallery();
    const { storeConfig } = talonProps;

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <CustomArrow />,
        prevArrow: <CustomArrow isNext={false} />,
        centerPadding: "60px",
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <h2
                className={cn(
                    'bg-darkblue-900 text-lg font-medium text-white leading-6 px-6 py-3 inline-block relative',
                    'after_border-l-[48px] after_border-t-[48px] after_border-b-0 after_border-r-0',
                    'after_border-l-darkblue-900 after_border-t-transparent after_border-r-transparent after_border-b-transparent',
                    'after_absolute after_right-[-48px] after_top-0'
                )}
            >
                More from this store
            </h2>
            <div className='related_products-container flex flex-col gap-x-4 gap-y-5 py-10 mb-4'>
                <Slider {...settings}>
                    {data.map((item) => {
                        return (
                            <GalleryItem
                                key={item.id}
                                item={item}
                                storeConfig={storeConfig}
                                rootClassName="px-2 block"
                            />
                        )
                    })}
                </Slider>
            </div>

            <style global jsx>
                {`
                    .related_products-container .slick-slider {
                        margin: 0 -8px;
                    }
                    @media only screen and (min-width: 1024px) {
                        .related_products-container .slick-slider {
                            margin: 0 -16px;
                        }
                    }
                `}
            </style>
        </>
    )
}

export default relatedProduct