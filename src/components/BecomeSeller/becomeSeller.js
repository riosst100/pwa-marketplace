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
import defaultClasses from './becomeSeller.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';
import GoogleRecaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';

const BecomeSeller = props => {
    const talonProps = useBecomeSeller({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const {
        errors,
        handleSubmit,
        handleChange,
        sellerType,
        handleEnterKeyPress,
        isDisabled,
        initialValues,
        recaptchaWidgetProps,
        isSeller
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
                id={'becomeSeller.becomeSellerText'}
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

    if (isSeller) {
        return '';
    }

    return !isSeller ? (
        <Form
            data-cy="BecomeSeller-form"
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onChange={handleChange}
        >
            <h2 data-cy="BecomeSeller-title" className={classes.title}>
                <FormattedMessage
                    id={'becomeSeller.becomeSellerText'}
                    defaultMessage={'Become a Seller'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <Field
                id="sellerType"
                label={formatMessage({
                    id: 'becomeSeller.sellerTypeText',
                    defaultMessage: 'Seller Type'
                })}
            >
                <Select
                    field="seller.seller_type"
                    id={classes.root}
                    items={sellerTypeOptions}
                />
            </Field>
            {sellerType == "company" && (
                <>
                    <Field
                        id="companyName"
                        label={formatMessage({
                            id: 'becomeSeller.companyNameText',
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
                        id="companyRegistrationNumber"
                        label={formatMessage({
                            id: 'becomeSeller.companyRegistrationNumberText',
                            defaultMessage: 'Company Registration Number'
                        })}
                    >
                        <TextInput
                            id="companyRegistrationNumber"
                            field="seller.company_registration_number"
                            validate={isRequired}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="seller-registrationnumber"
                            aria-label={formatMessage({
                                id: 'global.registration_numberRequired',
                                defaultMessage: 'Company Registration Number Required'
                            })}
                        />
                    </Field>
                </>
            )}
            <Field
                id="sellerProfileName"
                label={formatMessage({
                    id: 'becomeSeller.sellerProfileNameText',
                    defaultMessage: 'Store Name'
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
                        defaultMessage: 'Store Name is required.'
                    })}
                />
            </Field>
            <Field
                id="storeURL"
                label={formatMessage({
                    id: 'becomeSeller.storeURLText',
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
            <Country
                field="seller.country_id"
                validate={isRequired}
            />
            <Field
                id="addressLine1"
                label={formatMessage({
                    id: 'becomeSeller.addressLine1Text',
                    defaultMessage: 'Address Line 1'
                })}
            >
                <TextInput
                    id="addressLine1"
                    field="seller.address_line_1"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="seller-addressline1"
                    aria-label={formatMessage({
                        id: 'global.addressLine1Required',
                        defaultMessage: 'Address Line 1 is required'
                    })}
                />
            </Field>
            <Field
                id="addressLine2"
                label={formatMessage({
                    id: 'becomeSeller.addressLine2Text',
                    defaultMessage: 'Address Line 2'
                })}
            >
                <TextInput
                    id="addressLine2"
                    field="seller.address_line_2"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="seller-addressline2"
                    aria-label={formatMessage({
                        id: 'global.addressLine2Required',
                        defaultMessage: 'Address Line 2 is required'
                    })}
                />
            </Field>
            <Field
                id="city"
                label={formatMessage({
                    id: 'global.city',
                    defaultMessage: 'City'
                })}
            >
                <TextInput
                    id="city"
                    field="seller.city"
                    validate={isRequired}
                />
            </Field>
            <Region
                fieldInput="seller.region"
                fieldSelect="seller.region_id"
                label={formatMessage({
                    id: 'global.region',
                    defaultMessage: 'Region'
                })}
                countryCodeField="seller.country_id"
                validate={isRequired}
            />
            <Postcode
                validate={isRequired}
                fieldInput="seller.postcode"
                label={formatMessage({
                    id: 'global.postcode',
                    defaultMessage: 'Postal Code'
                })}
            />
            <Field
                id="contactNumber"
                label={formatMessage({
                    id: 'global.contactNumber',
                    defaultMessage: 'Contact Number'
                })}
            >
                <TextInput
                    id="contactNumber"
                    field="seller.contact_number"
                    validate={isRequired}
                />
            </Field>
            <div className={classes.subscribe}>
                <Checkbox
                    field="become_seller_agreement"
                    id="becomeSellerAgreement"
                    label={formatMessage({
                        id: 'becomeSeller.becomeSellerAgreementText',
                        defaultMessage: 'I agree the Terms and Condition (Terms and Conditions)'
                    })}
                />
            </div>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className={classes.actions}>
                {submitButton}
            </div>
        </Form>
    ) : '';
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
