import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { useBecomeSeller } from '@riosst100/pwa-seller-registration/src/talons/BecomeSeller/useBecomeSeller';

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
import defaultClasses from './becomeSeller.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Password from '@magento/venia-ui/lib/components/Password';
import GoogleRecaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';

const BecomeSeller = props => {
    const talonProps = useBecomeSeller({
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
            data-cy="BecomeSeller-cancelButton"
            className={classes.cancelButton}
            disabled={isDisabled}
            type="button"
            priority="low"
            onClick={handleCancel}
            onKeyDown={handleCancelKeyPress}
        >
            <FormattedMessage
                id={'becomeSeller.cancelText'}
                defaultMessage={'Cancel'}
            />
        </Button>
    );

    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={isDisabled}
            type="submit"
            priority="high"
            onKeyDown={handleEnterKeyPress}
            data-cy="BecomeSeller-submitButton"
        >
            <FormattedMessage
                id={'becomeSeller.becomeSellerText'}
                defaultMessage={'Create an Account'}
            />
        </Button>
    );

    return (
        <Form
            data-cy="BecomeSeller-form"
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <h2 data-cy="BecomeSeller-title" className={classes.title}>
                <FormattedMessage
                    id={'becomeSeller.becomeSellerText'}
                    defaultMessage={'Create an Account'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <Field
                id="firstName"
                label={formatMessage({
                    id: 'becomeSeller.firstNameText',
                    defaultMessage: 'First Name'
                })}
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
                    id: 'becomeSeller.lastNameText',
                    defaultMessage: 'Last Name'
                })}
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
                    id: 'becomeSeller.emailText',
                    defaultMessage: 'Email'
                })}
            >
                <TextInput
                    id="Email"
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
            <Password
                id="Password"
                autoComplete="new-password"
                fieldName="password"
                isToggleButtonHidden={false}
                label={formatMessage({
                    id: 'becomeSeller.passwordText',
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
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    id="subscribe"
                    label={formatMessage({
                        id: 'becomeSeller.subscribeText',
                        defaultMessage: 'Subscribe to news and updates'
                    })}
                />
            </div>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className={classes.actions}>
                {submitButton}
                {cancelButton}
            </div>
        </Form>
    );
};

BecomeSeller.propTypes = {
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

BecomeSeller.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default BecomeSeller;
