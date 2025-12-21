import React, {useState} from 'react';
import GoogleSignInButton from './googleSignInButton'
import { useSocialLogin } from '@riosst100/pwa-marketplace/src/talons/SocialLogin/useSocialLogin';
import LoadingRequest from '@riosst100/pwa-marketplace/src/components/LoadingRequest';

const SocialLogin = () => {
    const [jwtToken, setJwtToken] = useState(null);

    const talonProps = useSocialLogin({
        jwtToken
    });

    const {
        isLoading
    } = talonProps;

    return (
        <div className='relative flex w-full justify-center items-center'>
            <LoadingRequest isLoading={isLoading} />
            <GoogleSignInButton setToken={setJwtToken} />
        </div>
    )
}

export default SocialLogin;