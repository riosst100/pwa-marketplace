import React from 'react';
import { Form } from 'informed';
import Button from '@magento/venia-ui/lib/components/Button';
import Image from '@magento/venia-ui/lib/components/Image';
import Verify from '@riosst100/pwa-marketplace/src/components/CrossSeller/verifyIcon';
import Star from '@riosst100/pwa-marketplace/src/components/CrossSeller/starIcon';
import logoImage from '@riosst100/pwa-marketplace/src/components/CrossSeller/logo_seller.png';
import { Share, Trash } from 'iconsax-react';
import SocialShare from '@riosst100/pwa-marketplace/src/components/SocialMediaShare';
import { X } from 'react-feather';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import cn from 'classnames';
import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';
import { FormattedMessage } from 'react-intl';

const item = () => {
    const [open, setOpen] = React.useState(false);

    const handleRemoveFromFavorite = () => {
        alert('remove fav seller')
    }

    const handleGoToSellerPage = () => {
        alert('to seller page')
    }

    return (
        <>
            <Modal
                open={open}
                setOpen={setOpen}
                className={cn(
                    'max-w-max !min-h-auto px-[30px] pt-[30px] pb-10',
                )}
            >
                <div className='social_share-container flex flex-col gap-y-7'>
                    <div className='flex justify-between'>
                        <div className='text-lg font-semibold'>
                            Share to your friends
                        </div>
                        <button onClick={() => { setOpen(!open) }} >
                            <X size={24} color={primary900} />
                        </button>
                    </div>
                    <div className='flex flex-row border border-gray-100 rounded-md px-5 py-2.5 gap-x-2.5 items-center'>
                        <div className='flex flex-col'>
                            <div className='text-[14px] font-normal'>
                                Zen Market.TCG
                            </div>
                            <div className='text-[12px] font-normal text-gray-200'>
                                zenmarket-tcg.link
                            </div>
                        </div>
                    </div>
                    <SocialShare rootClassName="justify-center" />
                </div>
            </Modal>
            <div className='border border-gray-100 rounded-md p-5 flex flex-col md_flex-row justify-between gap-y-4'>
                <div className='seller_info-container flex flex-row gap-x-[15px]'>
                    <div className='logo_wrapper w-[100px] h-[100px]'>
                        <Image
                            alt='seller name'
                            className="relative mt-[-5px]"
                            src={logoImage}
                        />
                    </div>
                    <div className='flex flex-col gap-y-[15px]'>
                        <div className='flex flex-col gap-[6px]'>
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
                            <div className='flex flex-row gap-x-[5px] items-center'>
                                <span className='font-normal text-[12px] text-gray-200 '>
                                    Jurong West
                                </span>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <Button
                                classes={{
                                    content: 'gap-1.5 grid-flow-col inline-grid items-center justify-center justify-items-center capitalize font-medium text-[14px]',
                                    rootClass: 'py-[0px] h-9 hover_border-blue-700'
                                }}
                                onClick={handleGoToSellerPage}
                            >
                                <FormattedMessage
                                    id={'favoriteSeller.visitStore'}
                                    defaultMessage={'Visit Store'}
                                />
                            </Button>
                            <div
                                className='flex items-center justify-center gap-[5px] p-[9px] relative rounded-[30px] overflow-hidden border border-solid border-blue-600 hover_border-blue-700 cursor-pointer w-9 h-9'
                                onClick={() => { setOpen(!open) }}
                            >
                                <Share
                                    size="15"
                                    className='text-blue-600 group-hover_text-blue-800 left-[-1px]'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row justify-between md_justify-center items-center gap-5'>
                    <div className='flex flex-col gap-y-2'>
                        <div className='rating_sales flex flex-row gap-x-[5px] items-center'>
                            <Star width={18} height={18} />
                            <p className='font-semibold text-[18px] text-gray-600'>
                                4.7
                            </p>
                        </div>
                        <span className='text-gray-800 text-xs'>
                            <FormattedMessage
                                id={'favoriteSeller.RatingAndReviews'}
                                defaultMessage={'Rating & Reviews'}
                            />
                        </span>

                    </div>
                    <Button
                        data-cy="Product-Section-removeFavorite"
                        onClick={handleRemoveFromFavorite}
                        className="min-w-min border border-gray-200 rounded-full border-solid w-7 h-7 flex items-center justify-center hover_border-gray-600"
                    >
                        <Trash size="16" color="#999999" />
                    </Button>
                </div>
            </div>
        </>
    )
}

export default item