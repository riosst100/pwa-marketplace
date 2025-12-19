import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './signIn.module.css';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Password from '@magento/venia-ui/lib/components/Password';
import FormError from '@magento/venia-ui/lib/components/FormError/formError';
import GoogleRecaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import SocialLogin from '@riosst100/pwa-marketplace/src/components/SocialLogin';

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        handleTriggerClick,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        initialValues,
        setIsLoading,
        showSocialLogin = true,
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        handleTriggerClick,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        setIsLoading
    });

    const {
        errors,
        handleCreateAccount,
        handleEnterKeyPress,
        signinHandleEnterKeyPress,
        handleForgotPassword,
        forgotPasswordHandleEnterKeyPress,
        handleSubmit,
        isBusy,
        setFormApi,
        recaptchaWidgetProps
    } = talonProps;

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div data-cy="SignIn-root" className={cn(classes.root, '!p-[30px]')}>
            <FormError errors={Array.from(errors.values())} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
                data-cy="SignIn-form"
                initialValues={initialValues && initialValues}
            >
                <Field
                    id="email"
                    label={formatMessage({
                        id: 'signIn.emailAddressText',
                        defaultMessage: 'Email address'
                    })}
                    classes={{
                        root: "mb-6",
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
                >
                    <TextInput
                        id="email"
                        data-cy="SignIn-email"
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        aria-label={formatMessage({
                            id: 'global.emailRequired',
                            defaultMessage: 'Email Required'
                        })}
                        placeholder='johndoe@gmail.com'
                    />
                </Field>
                <Password
                    data-cy="SignIn-password"
                    fieldName="password"
                    id="Password"
                    label={formatMessage({
                        id: 'signIn.passwordText',
                        defaultMessage: 'Password'
                    })}
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                    aria-label={formatMessage({
                        id: 'global.passwordRequired',
                        defaultMessage: 'Password Required'
                    })}
                    placeholder={formatMessage({
                        id: 'signIn.passwordText',
                        defaultMessage: 'Password'
                    })}
                    classes={{
                        root: "mb-6",
                    }}
                />
                <div className={cn(classes.forgotPasswordButtonContainer, 'mb-6')}>
                    <LinkButton
                        // classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                        onKeyDown={forgotPasswordHandleEnterKeyPress}
                        data-cy="SignIn-forgotPasswordButton"
                    >
                        <span className='font-normal text-xs'>
                            <FormattedMessage
                                id={'signIn.forgotPasswordText'}
                                defaultMessage={'Forgot your password?'}
                            />
                        </span>
                    </LinkButton>
                </div>
                <GoogleRecaptcha {...recaptchaWidgetProps} />
                <div className={cn(classes.buttonsContainer, '!flex flex-col gap-y-6')}>
                    <Button
                        priority="high"
                        type="submit"
                        onKeyDown={signinHandleEnterKeyPress}
                        data-cy="SignInButton-root_highPriority"
                        disabled={isBusy}
                        classes={{
                            rootClass: '!w-full',
                            content: 'capitalize font-medium text-[16px]'
                        }}
                    >
                        {isBusy ? <FormattedMessage
                            id={'signIn.waitingConfig'}
                            defaultMessage={'Please wait...'}
                        /> : <FormattedMessage
                            id={'signIn.signInText'}
                            defaultMessage={'Sign In'}
                        />}
                    </Button>
                    <div className='block text-center'>
                        <span className='text-sm font-normal'>
                            <FormattedMessage
                                id={'signIn.dontHaveAccount'}
                                defaultMessage={"Don't have an account? "}
                            />
                        </span>
                        {' '}
                        <Link
                            to={'/create-account'}
                            className='text-xs font-normal text-blue-700 underline'
                        >
                            <FormattedMessage
                                id={'signIn.signUpNow'}
                                defaultMessage={"Sign up now "}
                            />
                        </Link>
                    </div>
                    <div className='max-w-[390px] w-full mx-auto'>
                        <label
                            className={cn(
                                'relative after_w-full after_h-[1px] after_bg-gray-100 after_block after_absolute after_top-1/2 z-[0]',
                                'w-full block'
                            )}>
                            <span
                                className={cn(
                                    'text-[14px] inline-block font-normal bg-white z-[1] relative px-5',
                                )}>
                                <FormattedMessage
                                    id={'signIn.orContinueWith'}
                                    defaultMessage={"Or continue with"}
                                />
                            </span>
                        </label>
                    </div>
                    <div className='relative mx-auto w-full max-w-[490px]'>
                        <SocialLogin />
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default SignIn;

SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func,
    initialValues: shape({
        email: string.isRequired
    })
};
SignIn.defaultProps = {
    setDefaultUsername: () => { },
    showCreateAccount: () => { },
    showForgotPassword: () => { }
};
