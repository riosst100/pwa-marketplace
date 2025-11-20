import React, { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './verifyEmail.module.css';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useHistory } from 'react-router-dom';
import { useVerifyEmailPage } from '@riosst100/pwa-marketplace/src/talons/VerifyEmailPage/useVerifyEmailPage';

const storage = new BrowserPersistence();

const VerifyEmailPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const email = storage.getItem('confirm_email');

    const history = useHistory();

    const { handleResendEmail, shouldShowLoadingIndicator } = useVerifyEmailPage({ email });
    
    useEffect(() => {
        if (!email) {
            history.push('/');
        }
    }, [email, history]);

    return email ? (
        <div className={classes.root}>
            <div className={classes.card}>
                <h2 className={classes.title}>
                    <FormattedMessage
                        id={'verifyEmail.title'}
                        defaultMessage={'Please verify your email'}
                    />
                </h2>
                {email ?
                <p className={classes.subtitle}>
                    <FormattedMessage
                        id={'verifyEmail.sentTo'}
                        defaultMessage={'You\'re almost there! We sent an email to'}
                    />
                    <br />
                    <span className={classes.email}>{email}</span>
                </p> : ''}
                <p className={classes.instructions}>
                    <FormattedMessage
                        id={'verifyEmail.instructions'}
                        defaultMessage={'Just click on the link in that email to complete your signup. If you don\'t see it, you may need to check your spam folder.'}
                    />
                </p>
                {shouldShowLoadingIndicator ? <button
                    className={classes.resendButton}
                    type="button"
                    style={{"opacity":"0.5"}}
                >
                    <FormattedMessage
                        id={'verifyEmail.sendingEmail'}
                        defaultMessage={'Sending Email...'}
                    />
                </button> :
                <button
                    className={classes.resendButton}
                    type="button"
                    onClick={handleResendEmail}
                >
                    <FormattedMessage
                        id={'verifyEmail.resend'}
                        defaultMessage={'Resend Email'}
                    />
                </button>}
                <div className={classes.contactHelp}>
                    <FormattedMessage
                        id={'verifyEmail.needHelp'}
                        defaultMessage={'Need help?'}
                    />{' '}
                    <a href="/contact" className={classes.contactLink}>
                        <FormattedMessage
                            id={'verifyEmail.contactUs'}
                            defaultMessage={'Contact Us'}
                        />
                    </a>
                </div>
            </div>
        </div>
    ) : '';
};

VerifyEmailPage.propTypes = {
    classes: shape({
        root: string,
        card: string,
        title: string,
        subtitle: string,
        email: string,
        instructions: string,
        resendButton: string,
        contactHelp: string,
        contactLink: string
    })
};

export default VerifyEmailPage;
