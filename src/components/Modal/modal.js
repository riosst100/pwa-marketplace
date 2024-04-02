import React from 'react';
import cn from 'classnames';
import { blackTransparent } from '@riosst100/pwa-marketplace/src/theme/vars'

const modal = (props) => {
    const {
        open = false, setOpen = () => { }, children = null,
        rootClassName = '', className = '', closeOutside = false,
    } = props;


    return (
        <>
            {open && (
                <div
                    className={cn(
                        'block overflow-hidden fixed top-0 right-0 left-0 z-dialog',
                        'justify-center items-center w-full h-full bg-[#11182780]',
                        rootClassName,
                    )}
                    onClick={() => {
                        closeOutside ? setOpen(!open) : '';
                    }}
                >
                    <div
                        className={cn(
                            'relative p-4 w-full min-h-[360px] max-w-md max-h-full',
                            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg',
                            className
                        )}
                    >

                        {children}
                    </div>
                    <style global jsx>
                        {`
                            body {
                                overflow: hidden !important;
                            }
                        `}
                    </style>
                </div>
            )}
        </>
    )
}

export default modal