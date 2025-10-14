import React from 'react';
import { Form } from 'informed';
import Button from '@magento/venia-ui/lib/components/Button';
import Image from '@magento/venia-ui/lib/components/Image';
import Verify from '@riosst100/pwa-marketplace/src/components/CrossSeller/verifyIcon';
import Star from '@riosst100/pwa-marketplace/src/components/CrossSeller/starIcon';
import logoImage from '@riosst100/pwa-marketplace/src/components/CrossSeller/logo_seller.png';
import { Share } from 'iconsax-react';
import SocialShare from '@riosst100/pwa-marketplace/src/components/SocialMediaShare';
import { X } from 'react-feather';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import cn from 'classnames';
import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';
import { FormattedMessage, useIntl } from 'react-intl';
import useRemoveFavoriteSeller from '@riosst100/pwa-marketplace/src/talons/FavoriteSeller/FavoriteSellerList/useRemoveFavoriteSeller';
import { useState } from 'react';
import { useToasts } from '@magento/peregrine';

const Item = ({ sellerItem, refetchFavoriteSellerList }) => {
    const [open, setOpen] = useState(false);
    const { remove, loading: removing } = useRemoveFavoriteSeller();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const handleRemoveFromFavorite = async () => {
        try {
            await remove([sellerItem.seller.seller_id]);
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'favoriteSeller.toastUnfollowSuccess',
                    defaultMessage: 'Successfully unfollowed seller.'
                }),
                timeout: 3000
            });
            if (typeof refetchFavoriteSellerList === 'function') {
                await refetchFavoriteSellerList();
            }
        } catch (e) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'favoriteSeller.toastUnfollowError',
                    defaultMessage: 'Failed to unfollow seller.'
                }),
                timeout: 3000
            });
            console.error('Failed to unfollow seller:', e);
        }
    };

    const handleGoToSellerPage = () => {
        if (sellerItem?.seller?.url) {
            window.location.href = sellerItem.seller.url;
        } else {
            alert('to seller page');
        }
    };

    return (
        <>
            <div className='border border-gray-100 rounded-md p-5 flex flex-col md_flex-row justify-between gap-y-4 relative'>
                {removing && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
                        <span className="text-sm text-gray-700">
                            <FormattedMessage
                                id="favoriteSeller.unfollowing"
                                defaultMessage="Unfollowing..."
                            />
                        </span>
                    </div>
                )}
                <div className='seller_info-container flex flex-row gap-x-[15px]'>
                    <div className='flex flex-col gap-y-[15px]'>
                        <div className='flex flex-col gap-[6px]'>
                            <div className='seller_summary-wrapper flex flex-row gap-x-2.5 items-center'>
                                <div className='seller_name text-lg font-medium leading-6'>
                                    {sellerItem?.seller?.name || '-'}
                                </div>
                            </div>
                            <div className='flex flex-row gap-x-[5px] items-center'>
                                <span className='font-normal text-[12px] text-gray-200 '>
                                    {sellerItem?.seller?.description || '-'}
                                </span>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <Button
                                classes={{
                                    content: 'gap-1.5 grid-flow-col inline-grid items-center justify-center justify-items-center capitalize font-medium text-[14px]',
                                    rootClass: 'py-[0px] h-9 hover_border-orange-500 border-orange-500 text-[#f76b1c]'
                                }}
                                onClick={handleGoToSellerPage}
                                variant="outlined"
                            >
                                <FormattedMessage
                                    id={'favoriteSeller.visitStore'}
                                    defaultMessage={'Visit Store'}
                                />
                            </Button>
                            <Button
                                classes={{
                                    content: 'gap-1.5 grid-flow-col inline-grid items-center justify-center justify-items-center capitalize font-medium text-[14px]',
                                    rootClass: 'py-[0px] h-9 hover_border-orange-500 border-orange-500 text-[#f76b1c]'
                                }}
                                onClick={handleRemoveFromFavorite}
                                disabled={removing}
                                variant="outlined"
                            >
                                <FormattedMessage
                                    id={'favoriteSeller.unfollow'}
                                    defaultMessage={'Unfollow'}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Item;