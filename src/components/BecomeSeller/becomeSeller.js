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
import SellerCountry from '@riosst100/pwa-marketplace/src/components/SellerCountry';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import cn from 'classnames';

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
            className={cn(classes.submitButton, 'w-full')}
            disabled={isDisabled}
            type="submit"
            priority="high"
            onKeyDown={handleEnterKeyPress}
            data-cy="BecomeSeller-submitButton"
            classes={{
                content: 'font-semibold text-[16px] capitalize',
            }}
        >
            <FormattedMessage
                id={'becomeSeller.becomeSellerText'}
                defaultMessage={'Register'}
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
            <h2 data-cy="BecomeSeller-title" className="capitalize text-lg font-semibold mb-[70px]">
                <FormattedMessage
                    id={'becomeSeller.becomeSellerText'}
                    defaultMessage={'Register as Seller'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <h3 className='text-[16px] leading-5 font-medium text-left mb-[30px]'>
                <FormattedMessage
                    id={'becomeSeller.storeInformation'}
                    defaultMessage={'Store Information'}
                />
            </h3>
            <div className='md_grid md_grid-cols-2 md_gap-6'>
                <Field
                    id="sellerType"
                    label={formatMessage({
                        id: 'becomeSeller.sellerTypeText',
                        defaultMessage: 'Seller Type'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
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
                            classes={{
                                label: "font-normal text-left mb-2 text-[14px] block mb-2"
                            }}
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
                                placeholder={formatMessage({
                                    id: 'becomeSeller.placeholder.companyName',
                                    defaultMessage: 'Your company name'
                                })}
                            />
                        </Field>
                        <Field
                            id="companyRegistrationNumber"
                            label={formatMessage({
                                id: 'becomeSeller.companyRegistrationNumberText',
                                defaultMessage: 'Company Registration Number'
                            })}
                            classes={{
                                label: "font-normal text-left mb-2 text-[14px] block mb-2"
                            }}
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
                                placeholder={formatMessage({
                                    id: 'becomeSeller.placeholder.registrationNumber',
                                    defaultMessage: 'Your company registration number'
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
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
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
                        placeholder={formatMessage({
                            id: 'becomeSeller.placeholder.storeTitle',
                            defaultMessage: 'Your store title'
                        })}
                    />
                </Field>
                <Field
                    id="storeURL"
                    label={formatMessage({
                        id: 'becomeSeller.storeURLText',
                        defaultMessage: 'Store URL'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block"
                    }}
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
                        placeholder={formatMessage({
                            id: 'becomeSeller.placeholder.storeUrl',
                            defaultMessage: 'Your store url'
                        })}
                    />
                    <label className='text-left text-xs font-normal text-gray-400 mt-2'>
                        <FormattedMessage
                            id={'becomeSeller.urlNotes'}
                            defaultMessage={`Please enter a valid Store URL (Ex: "tcg-collective").
                                Your Store URL will be https://tcg.com/seller/tcg-collective.html`}
                        />
                    </label>
                </Field>
            </div>
            <p className='text-left text-xs font-normal text-red-600 mt-6'>
                <FormattedMessage
                    id={'becomeSeller.requiredField'}
                    defaultMessage={'* Required fields must be filled in.'}
                />
            </p>
            <h3 className='text-[16px] leading-5 font-medium text-left mt-[60px] mb-[30px]'>
                <FormattedMessage
                    id={'becomeSeller.storeInformation'}
                    defaultMessage={'Store Information'}
                />
            </h3>
            <div className='md_grid md_grid-cols-2 md_gap-6'>
                <Field
                    id="addressLine1"
                    label={formatMessage({
                        id: 'becomeSeller.addressLine1Text',
                        defaultMessage: 'Address Line 1'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block"
                    }}
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
                        placeholder={formatMessage({
                            id: 'becomeSeller.placeholder.addressLine1',
                            defaultMessage: 'Address line 1'
                        })}
                    />
                </Field>
                <Field
                    id="addressLine2"
                    label={formatMessage({
                        id: 'becomeSeller.addressLine2Text',
                        defaultMessage: 'Address Line 2'
                    })} optional={true}
                    classes={{
                        label: "flex items-center justify-between text-colorDefault font-normal text-left mb-2 text-[14px] mb-2"
                    }}
                >
                    <TextInput
                        id="addressLine2"
                        field="seller.address_line_2"
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="seller-addressline2"
                        placeholder={formatMessage({
                            id: 'becomeSeller.placeholder.addressLine2',
                            defaultMessage: 'Address line 2'
                        })}
                    />
                </Field>
                <SellerCountry
                    field="seller.country_id"
                    validate={isRequired}
                />
                <div>
                    <Region
                        fieldInput="seller.region"
                        fieldSelect="seller.region_id"
                        label={formatMessage({
                            id: 'global.region',
                            defaultMessage: 'State / Province'
                        })}
                        translationId="global.region"
                        countryCodeField="seller.country_id"
                        validate={isRequired}
                        placeholder={formatMessage({
                            id: 'global.region',
                            defaultMessage: 'State / Province'
                        })}
                    />
                </div>
                <Field
                    id="city"
                    label={formatMessage({
                        id: 'global.city',
                        defaultMessage: 'City'
                    })}
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
                >
                    <TextInput
                        id="city"
                        field="seller.city"
                        validate={isRequired}
                        placeholder={formatMessage({
                            id: 'becomeSeller.placeholder.city',
                            defaultMessage: 'City'
                        })}
                    />
                </Field>
                <Postcode
                    validate={isRequired}
                    fieldInput="seller.postcode"
                    label={formatMessage({
                        id: 'global.postcode',
                        defaultMessage: 'Postal Code'
                    })}
                    placeholder={formatMessage({
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
                    classes={{
                        label: "font-normal text-left mb-2 text-[14px] block mb-2"
                    }}
                >
                    <TextInput
                        id="contactNumber"
                        field="seller.contact_number"
                        validate={isRequired}
                        placeholder={formatMessage({
                            id: 'becomeSeller.placeholder.phoneNumber',
                            defaultMessage: 'Your phone number'
                        })}
                    />
                </Field>
            </div>
            <div className={cn(classes.subscribe, 'ml-0 mt-5')}>
                <Checkbox
                    field="become_seller_agreement"
                    id="becomeSellerAgreement"
                    validate={isRequired}
                    label={(
                        <>
                            {formatMessage({
                                id: 'becomeSeller.becomeSellerAgreementText',
                                defaultMessage: 'I agree the Terms and Condition'
                            })} <span>
                                (<a href={'/seller-term-conditions'}>
                                    <u>
                                        {formatMessage({
                                            id: 'becomeSellerPage.termConditions',
                                            defaultMessage: 'Terms and Conditions'
                                        })}
                                    </u>
                                </a>)
                            </span>
                        </>
                    )}
                />
            </div>
            <p className='text-left text-xs font-normal text-red-600 mt-6'>
                <FormattedMessage
                    id={'becomeSeller.requiredField'}
                    defaultMessage={'* Required fields must be filled in.'}
                />
            </p>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className="max-w-[490px] mx-auto relative mt-[60px] mb-6 block">
                {submitButton}
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
                        id={'createAccount.SignInAsSeller'}
                        defaultMessage={"Sign in as seller now "}
                    />
                </Link>
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
    onCancel: () => { },
    isCancelButtonHidden: true
};

export default BecomeSeller;
