import React, { Fragment, useState } from 'react';
import { node, shape, string } from 'prop-types';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './phoneTextInput.module.css';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const PhoneTextInput = props => {
    const {
        after,
        before,
        classes: propClasses,
        regionError,
        field,
        message,
        countryCodeField = "country",
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const { value: phoneValue } = fieldState;
    const classes = useStyle(defaultClasses, propClasses);
    var inputClass =
        fieldState.error || regionError ? classes.input_error : classes.input;
    
    const handleChange = (value) => {
        fieldState.value = value;
    }

    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;

    return (
        <Fragment>
            <FieldIcons after={after} before={before}>
                <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry={country}
                name={field}
                value={phoneValue}
                onChange={handleChange}
                />
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default PhoneTextInput;

PhoneTextInput.propTypes = {
    after: node,
    before: node,
    classes: shape({
        input: string
    }),
    field: string.isRequired,
    message: node
};
