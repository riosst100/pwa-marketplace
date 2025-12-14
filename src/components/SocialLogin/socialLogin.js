import React, {useState} from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import Image from '@magento/venia-ui/lib/components/Image';
import GoogleIcon from './img/google.svg';
import FacebookIcon from './img/facebook.svg';
import InstagramIcon from './img/instagram.svg';
import WechatIcon from './img/wechat.svg';
import WeiboIcon from './img/weibo.svg';
import GoogleSignInButton from './googleSignInButton'
import { useSocialLogin } from '@riosst100/pwa-marketplace/src/talons/SocialLogin/useSocialLogin';

const SocialLogin = () => {
    const [jwtToken, setJwtToken] = useState(null);

    const talonProps = useSocialLogin({
        jwtToken
    });

    // const {
    //     errors,
    //     handleCreateAccount,
    //     handleEnterKeyPress,
    //     signinHandleEnterKeyPress,
    //     handleForgotPassword,
    //     forgotPasswordHandleEnterKeyPress,
    //     handleSubmit,
    //     isBusy,
    //     setFormApi,
    //     recaptchaWidgetProps
    // } = talonProps;

    return (
        <div className='relative flex w-full justify-center items-center'>
            <GoogleSignInButton setToken={setJwtToken} />
            {/* <Button
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
            </Button> */}
        </div>
    )
}

export default SocialLogin;