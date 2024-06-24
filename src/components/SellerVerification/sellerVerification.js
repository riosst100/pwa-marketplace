import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { useBecomeSeller } from '@riosst100/pwa-marketplace/src/talons/BecomeSeller/useBecomeSeller';

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
import Select from '@magento/venia-ui/lib/components/Select';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './sellerVerification.module.css';
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
        handleSubmit,
        handleEnterKeyPress,
        isDisabled,
        initialValues,
        recaptchaWidgetProps
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    
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
                id={'sellerVerification.sellerVerificationText'}
                defaultMessage={'Become a Seller'}
            />
        </Button>
    );

    const sellerTypeOptions = [
        {
            value: "individual",
            label: "Individual"
        },
        {
            value: "company",
            label: "Company"
        }
    ];

    return (
        <Form
            data-cy="BecomeSeller-form"
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <h2 data-cy="BecomeSeller-title" className={classes.title}>
                <FormattedMessage
                    id={'sellerVerification.sellerVerificationText'}
                    defaultMessage={'Become a Seller'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <Field
                id="sellerType"
                label={formatMessage({
                    id: 'sellerVerification.sellerTypeText',
                    defaultMessage: 'Seller Type'
                })}
            >
                <Select
                    field="seller.seller_type"
                    id={classes.root}
                    items={sellerTypeOptions}
                />
            </Field>
            <Field
                id="sellerProfileName"
                label={formatMessage({
                    id: 'sellerVerification.sellerProfileNameText',
                    defaultMessage: 'Seller Profile Name'
                })}
            >
                <TextInput
                    id="sellerProfileName"
                    field="seller.seller_profile_name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="seller-profilename"
                    aria-label={formatMessage({
                        id: 'global.sellerProfileNameRequired',
                        defaultMessage: 'Seller Profile Name is required.'
                    })}
                />
            </Field>
            <Field
                id="companyName"
                label={formatMessage({
                    id: 'sellerVerification.companyNameText',
                    defaultMessage: 'Company Name'
                })}
            >
                <TextInput
                    id="companyName"
                    field="seller.company_name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="seller-companyname"
                    aria-label={formatMessage({
                        id: 'global.companyNameRequired',
                        defaultMessage: 'Company Name Required'
                    })}
                />
            </Field>
            <Field
                id="storeURL"
                label={formatMessage({
                    id: 'sellerVerification.storeURLText',
                    defaultMessage: 'Store URL'
                })}
            >
                <TextInput
                    id="storeUrl"
                    field="seller.store_url"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="seller-storeurl"
                    aria-label={formatMessage({
                        id: 'global.storeUrlRequired',
                        defaultMessage: 'Store URL is required.'
                    })}
                />
            </Field>
            <div className={classes.subscribe}>
                <Checkbox
                    field="become_seller_agreement"
                    id="sellerVerificationAgreement"
                    label={formatMessage({
                        id: 'sellerVerification.sellerVerificationAgreementText',
                        defaultMessage: 'I agree the Terms and Condition (Terms and Conditions)'
                    })}
                />
            </div>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className={classes.actions}>
                {submitButton}
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
        sellerProfileName: string,
        companyName: string
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
