import React from 'react';
import Slider from "react-slick";
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import cn from 'classnames';
import Item from './item';
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

const brandSlider = (props) => {

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
                    slidesToShow: 4,
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
        <div className='brand_items-container flex flex-col gap-x-4 gap-y-5'>
            <div className='text-[18px] font-medium'>
                Shop by brands
            </div>
            <Slider {...settings}>
                {[...Array(9)].map(() => {
                    return (
                        <Item />
                    )
                })}
            </Slider>
            <style global jsx>
                {`
                    .brand_items-container .slick-slider {
                        margin: 0 -8px;
                    }
                    @media only screen and (min-width: 1024px) {
                        .brand_items-container .slick-slider {
                            margin: 0 -16px;
                        }
                    }
                `}
            </style>
        </div>
    )
}

export default brandSlider