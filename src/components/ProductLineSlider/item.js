import React from 'react';
import cn from 'classnames';
import Image from '@magento/venia-ui/lib/components/Image';
import NendroidImage from './nendroid-image.png';
import NendroidLogo from './logo_nendoroid.png';

const Item = (props) => {
    const {
        name = 'Nendroid Series', rootClassName, onClick = () => { },
        className = "",
    } = props;

    return (
        <div className={cn('brand-item-container px-2 lg_px-4', rootClassName)} onClick={onClick}>
            <div
                className={cn(
                    'm-auto flex flex-row justify-center items-center',
                    'w-full max-w-[300px] px-5 py-2.5',
                    'relative rounded-lg border border-gray-100 bg-white',
                    className,
                )}
            >
                <Image
                    alt='image'
                    className="relative"
                    src={NendroidImage}
                />
                <Image
                    alt='logo'
                    className="relative"
                    src={NendroidLogo}
                />
            </div>
        </div>
    )
}

export default Item;