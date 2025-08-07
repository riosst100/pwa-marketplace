import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';

import { useStyle } from '@magento/venia-ui/lib/classify';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './createAccount.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Password from '@magento/venia-ui/lib/components/Password';
import GoogleRecaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import { Link } from 'react-router-dom';
import SocialLogin from '@riosst100/pwa-marketplace/src/components/SocialLogin';
import cn from 'classnames';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const {
        errors,
        handleCancel,
        handleSubmit,
        handleEnterKeyPress,
        handleCancelKeyPress,
        isDisabled,
        initialValues,
        recaptchaWidgetProps
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const cancelButton = props.isCancelButtonHidden ? null : (
        <Button
            data-cy="CreateAccount-cancelButton"
            className={classes.cancelButton}
            disabled={isDisabled}
            type="button"
            priority="low"
            onClick={handleCancel}
            onKeyDown={handleCancelKeyPress}
        >
            <FormattedMessage
                id={'createAccount.cancelText'}
                defaultMessage={'Cancel'}
            />
        </Button>
    );

    const submitButton = (
        <Button
            className={cn(classes.submitButton, 'w-full max-w-[490px]')}
            disabled={isDisabled}
            type="submit"
            priority="high"
            onKeyDown={handleEnterKeyPress}
            data-cy="CreateAccount-submitButton"
            classes={{
                content: 'font-medium text-[16px] capitalize',
            }}
        >
            <FormattedMessage
                id={'createAccount.createAccountText'}
                defaultMessage={'Create an Account'}
            />
        </Button>
    );

    return (
        <Form
            data-cy="CreateAccount-form"
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <h2 data-cy="CreateAccount-title" className={classes.title}>
                <FormattedMessage
                    id={'createAccount.createAccountText'}
                    defaultMessage={'Sign Up'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <div className='grid grid-cols-2 gap-6'>
                <Field
                    id="firstName"
                    label={formatMessage({
                        id: 'createAccount.firstNameText',
                        defaultMessage: 'First Name'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
                >
                    <TextInput
                        id="firstName"
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-firstname"
                        aria-label={formatMessage({
                            id: 'global.firstNameRequired',
                            defaultMessage: 'First Name Required'
                        })}
                    />
                </Field>
                <Field
                    id="lastName"
                    label={formatMessage({
                        id: 'createAccount.lastNameText',
                        defaultMessage: 'Last Name'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
                >
                    <TextInput
                        id="lastName"
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-lastname"
                        aria-label={formatMessage({
                            id: 'global.lastNameRequired',
                            defaultMessage: 'Last Name Required'
                        })}
                    />
                </Field>
                <Field
                    id="Email"
                    label={formatMessage({
                        id: 'createAccount.emailText',
                        defaultMessage: 'Email'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
                >
                    <TextInput
                        id="EmailField"
                        field="customer.email"
                        autoComplete="email"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-email"
                        aria-label={formatMessage({
                            id: 'global.emailRequired',
                            defaultMessage: 'Email Required'
                        })}
                    />
                </Field>
                <Field
                    id="PhoneNumberField"
                    label={formatMessage({
                        id: 'createAccount.phoneNumber',
                        defaultMessage: 'Phone Number'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
                >
                    <TextInput
                        id="phoneNumber"
                        field="customer.phoneNumber"
                        autoComplete="phoneNumber"
                        // validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-phoneNumber"
                        aria-label={formatMessage({
                            id: 'global.phoneNumberRequired',
                            defaultMessage: 'Phone Number Required'
                        })}
                    />
                </Field>
                <Password
                    id="Password"
                    autoComplete="new-password"
                    fieldName="password"
                    isToggleButtonHidden={false}
                    label={formatMessage({
                        id: 'createAccount.passwordText',
                        defaultMessage: 'Password'
                    })}
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword
                    ])}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="password"
                    aria-label={formatMessage({
                        id: 'global.passwordRequired',
                        defaultMessage: 'Password Required'
                    })}
                />
                <Password
                    id="ConfirmPassword"
                    autoComplete="confirm-password"
                    fieldName="confirmpassword"
                    isToggleButtonHidden={false}
                    label={formatMessage({
                        id: 'createAccount.confirmPassword',
                        defaultMessage: 'Confirm Password'
                    })}
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword
                    ])}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="password"
                    aria-label={formatMessage({
                        id: 'global.confirmPasswordRequired',
                        defaultMessage: 'Confirm Password Required'
                    })}
                />
            </div>
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    id="subscribe"
                    label={formatMessage({
                        id: 'createAccount.subscribeText',
                        defaultMessage: 'Subscribe to news and updates'
                    })}
                />
            </div>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className="flex w-full justify-center">
                {submitButton}
                {/* {cancelButton} */}
            </div>
            <div className='block'>
                <span className='text-xs font-normal'>
                    <FormattedMessage
                        id={'createAccount.alreadyHaveAccount'}
                        defaultMessage={"Already have an account ?"}
                    />
                </span>
                {' '}
                <Link
                    to={'/sign-in'}
                    className='text-xs font-normal text-blue-700 underline'
                >
                    <FormattedMessage
                        id={'createAccount.SignIn'}
                        defaultMessage={"Sign in now "}
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
        </Form>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => { },
    isCancelButtonHidden: true
};

export default CreateAccount;
