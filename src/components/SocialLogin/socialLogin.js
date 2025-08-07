import React from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import Image from '@magento/venia-ui/lib/components/Image';
import GoogleIcon from './img/google.svg';
import FacebookIcon from './img/facebook.svg';
import InstagramIcon from './img/instagram.svg';
import WechatIcon from './img/wechat.svg';
import WeiboIcon from './img/weibo.svg';

const socialLogin = () => {
    return (
        <div className='relative flex w-full justify-between items-center'>
            <Button
                className="shadow-type-1 p-[14px] rounded-full w-[52px] h-[52px]"
            >
                <Image
                    alt='google'
                    className="relative"
                    src={GoogleIcon}
                />
            </Button>
            <Button
                className="shadow-type-1 p-[14px] rounded-full w-[52px] h-[52px]"
            >
                <Image
                    alt='facebook'
                    className="relative"
                    src={FacebookIcon}
                />
            </Button>
            <Button
                className="shadow-type-1 p-[14px] rounded-full w-[52px] h-[52px]"
            >
                <Image
                    alt='instagram'
                    className="relative"
                    src={InstagramIcon}
                />
            </Button>
            <Button
                className="shadow-type-1 p-[14px] rounded-full w-[52px] h-[52px]"
            >
                <Image
                    alt='wechat'
                    className="relative"
                    src={WechatIcon}
                />
            </Button>
            <Button
                className="shadow-type-1 p-[14px] rounded-full w-[52px] h-[52px]"
            >
                <Image
                    alt='weibo'
                    className="relative"
                    src={WeiboIcon}
                />
            </Button>

            <style global jsx>
                {`
                    img[loading="eager"] {
                        display: contents;
                    }
                `}
            </style>
        </div>
    )
}

export default socialLogin