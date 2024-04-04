import React, { Fragment } from 'react';
import { node, shape, string } from 'prop-types';
import { Text as InformedText } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './textInput.module.css';
import cn from 'classnames';

const TextInput = props => {
    const {
        after,
        before,
        classes: propClasses,
        regionError,
        field,
        message,
        className = {},
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const { inputClassName = '' } = className;
    var inputClass =
        fieldState.error || regionError ? classes.input_error : classes.input;

    return (
        <Fragment>
            <FieldIcons after={after} before={before} >
                <InformedText
                    {...rest}
                    className={cn(
                        inputClass,
                        'focus_shadow-none !border rounded-md',
                        inputClassName
                    )}
                    field={field}
                />
            </FieldIcons>
            <Message
                classes={{
                    root: 'text-[12px] font-normal',
                    root_error: 'text-[12px] font-normal mt-1 text-red-400'
                }}
                fieldState={fieldState}
            >
                {message}
            </Message>
        </Fragment>
    );
};

export default TextInput;

TextInput.propTypes = {
    after: node,
    before: node,
    classes: shape({
        input: string
    }),
    field: string.isRequired,
    message: node
};
