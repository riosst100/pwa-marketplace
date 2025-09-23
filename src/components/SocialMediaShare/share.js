import React from 'react';
import {
    Sms, Whatsapp, Facebook, Link as LinkIcon
} from 'iconsax-react';
import cn from 'classnames';

const share = (props) => {
    const { rootClassName, className, handleShareLink } = props
    return (
        <>
            <div className={cn('button_share_group flex flex-wrap gap-4', rootClassName)}>
                <button
                    type='button'
                    className={cn(
                        'button_share border border-solid border-gray-100 p-2.5',
                        'rounded-full flex justify-center items-center h-fitContent',
                        className
                    )}
                    onClick={() => {
                        handleShareLink('wa')
                    }}
                >
                    <Whatsapp
                        size="20"
                        color="#25D366"
                    />
                </button>
                {/* <button
                    type='button'
                    className={cn(
                        'button_share border border-solid border-gray-100 p-2.5',
                        'rounded-full flex justify-center items-center h-fitContent',
                        className
                    )}
                >
                    <Instagram
                        size="20"
                        color="#ee2a7b"
                    />
                </button> */}
                <button
                    type='button'
                    className={cn(
                        'button_share border border-solid border-gray-100 p-2.5',
                        'rounded-full flex justify-center items-center h-fitContent',
                        className
                    )}
                    onClick={() => {
                        handleShareLink('fb')
                    }}
                >
                    <Facebook
                        size="20"
                        color="#4267B2"
                    />
                </button>
                <button
                    type='button'
                    className={cn(
                        'button_share border border-solid border-gray-100 p-2.5',
                        'rounded-full flex justify-center items-center h-fitContent',
                        className
                    )}
                    onClick={() => {
                        handleShareLink('email')
                    }}
                >
                    <Sms
                        size="20"
                        color="#005947"
                    />
                </button>
                <button
                    type='button'
                    className={cn(
                        'button_share border border-solid border-gray-100 p-2.5',
                        'rounded-full flex justify-center items-center h-fitContent',
                        className
                    )}
                    onClick={() => {
                        handleShareLink('link')
                    }}
                >
                    <LinkIcon
                        size="20"
                        color="#999999"
                    />
                </button>
            </div>
        </>
    )
}

export default share