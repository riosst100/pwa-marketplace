import React, { useMemo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './confirmEmail.module.css';
import { useHistory, Link } from 'react-router-dom';
import { useConfirmEmailPage } from '@riosst100/pwa-marketplace/src/talons/ConfirmEmailPage/useConfirmEmailPage';

const ConfirmEmailPage = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { location } = globalThis;

    const query = new URLSearchParams(location.search);
    const key = query.get('key') || null;
    const id = query.get('id') || null;

    const { handleConfirmEmail, shouldShowLoadingIndicator, isSuccess } = useConfirmEmailPage({ id, key });
    
    useEffect(() => {
        handleConfirmEmail();
    }, [handleConfirmEmail]);

    return (
        <div className={classes.root}>
            <div className={classes.card}>
                {shouldShowLoadingIndicator ? <><h2 className={classes.title}>
                    <FormattedMessage
                        id={'verifyEmail.titleVerified'}
                        defaultMessage={'Confirming Your Email Address'}
                    />
                </h2>
                <p className={classes.subtitle}>
                    <FormattedMessage
                        id={'verifyEmail.canSignIn'}
                        defaultMessage={'Please wait a moment while we verify your email address. This may take a few seconds.'}
                    />
                </p>
                <br /></> : (isSuccess ? <><h2 className={classes.title}>
                    <FormattedMessage
                        id={'verifyEmail.titleVerified'}
                        defaultMessage={'Your email has been verified'}
                    />
                </h2>
                <p className={classes.subtitle}>
                    <FormattedMessage
                        id={'verifyEmail.canSignIn'}
                        defaultMessage={'You can now Sign In with your account'}
                    />
                </p>
                <br />
                <Link
                    className={classes.resendButton}
                    to={'/sign-in'}
                >
                    <FormattedMessage
                        id={'verifyEmail.signInButton'}
                        defaultMessage={'Sign In'}
                    />
                </Link></> : <><h2 className={classes.title}>
                    <FormattedMessage
                        id={'verifyEmail.titleExpired'}
                        defaultMessage={'Email Confirmation Failed'}
                    />
                </h2>
                <p className={classes.subtitle}>
                    <FormattedMessage
                        id={'verifyEmail.notValid'}
                        defaultMessage={'The email verification link has expired or is no longer valid.'}
                    />
                </p></>)}
            </div>
        </div>
    )
};

export default ConfirmEmailPage;
