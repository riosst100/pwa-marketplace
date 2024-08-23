import React from 'react';
import cn from 'classnames';
import { Share } from 'iconsax-react';
import { X } from 'react-feather';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import SocialShare from '@riosst100/pwa-marketplace/src/components/SocialMediaShare';
import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars'

const brandInfo = () => {

    const initialName = (name) => {
        if (!name) return ""; // Handle empty names

        const words = name.split(" ");
        let initials = "";

        for (const word of words) {
            initials += word.charAt(0).toUpperCase();
        }

        return initials;
    }

    const [open, setOpen] = React.useState(false)

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
                        <div className='text-lg font-medium'>
                            Share to your friends
                        </div>
                        <button onClick={() => { setOpen(!open) }} >
                            <X size={24} color={primary900} />
                        </button>
                    </div>
                    <div className='flex flex-row border border-gray-100 rounded-md px-5 py-2.5 gap-x-2.5 items-center'>
                        <div
                            className={cn(
                                'bg-darkblue-900 text-white uppercase text-lg font-bold leading-5',
                                'p-2 rounded-md relative w-12 h-12 text-center flex items-center justify-center'
                            )}
                        >
                            {initialName('Bandai Namco')}
                        </div>
                        <div className='flex flex-col'>
                            <div className='text-[14px] font-normal'>
                                Bandai Namco.TCG
                            </div>
                            <div className='text-[12px] font-normal text-gray-200'>
                                bandainamco-tcg.link
                            </div>
                        </div>
                    </div>
                    <SocialShare rootClassName="justify-center" />
                </div>
            </Modal>
            <div className='flex justify-between items-center border border-gray-100 p-5 rounded-md mt-[30px] mb-8'>
                <div className='brand_name-wrapper flex gap-x-[15px] items-center'>
                    <div
                        className={cn(
                            'bg-darkblue-900 text-white uppercase text-lg font-bold leading-5',
                            'p-5 rounded-md relative w-[100px] h-[100px] text-center flex items-center justify-center'
                        )}
                    >
                        {initialName('Bandai Namco')}
                    </div>
                    <div className='text-lg font-medium'>
                        Bandai Namco
                    </div>
                </div>
                <div
                    className='share-wrapper border border-blue-600 rounded-md p-2 group cursor-pointer'
                    onClick={() => { setOpen(!open) }}
                >
                    <Share
                        size="15"
                        className='text-blue-600 group-hover_text-blue-800'
                    />
                </div>
            </div>
        </>
    )
}

export default brandInfo