import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantityStepper } from '@magento/peregrine/lib/talons/QuantityStepper/useQuantityStepper';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '../TextInput';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './quantityStepper.module.css';
import cn from 'classnames';

const QuantityStepper = props => {
    const { initialValue, itemId, label, min, onChange, message } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const iconClasses = { root: classes.icon };

    const talonProps = useQuantityStepper({
        initialValue,
        min,
        onChange
    });

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    } = talonProps;

    const errorMessage = message ? <Message>{message}</Message> : null;

    return (
        <Fragment>
            <div
                className={cn(
                    classes.root,
                    'flex w-fit border border-gray-100 rounded-md',
                    ''
                )}
            >
                <label className={classes.label} htmlFor={itemId}>
                    {label}
                </label>
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonDecrement',
                        defaultMessage: 'Decrease Quantity'
                    })}
                    className={cn(
                        classes.button_decrement,
                        '!h-full min-w-[40px] min-h-[40px]'
                    )}
                    disabled={isDecrementDisabled}
                    onClick={handleDecrement}
                    type="button"
                    data-cy="Quantity-decrementButton"
                >
                    <Icon classes={iconClasses} src={MinusIcon} size={22} />
                </button>
                <TextInput
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    data-cy="QuantityStepper-input"
                    classes={{
                        input: cn(
                            classes.input,
                            '!border max-w-[60px] focus_shadow-none focus_outline-[1px]',
                            '!border-t-0 !border-b-0 !rounded-none !border-gray-100'
                        )
                    }}
                    field="quantity"
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    onBlur={handleBlur}
                    pattern="[0-9]*"
                />
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonIncrement',
                        defaultMessage: 'Increase Quantity'
                    })}
                    className={cn(
                        classes.button_increment,
                        '!h-full min-w-[40px] min-h-[40px]'
                    )}
                    disabled={isIncrementDisabled}
                    onClick={handleIncrement}
                    type="button"
                    data-cy="Quantity-incrementButton"
                >
                    <Icon classes={iconClasses} src={PlusIcon} size={20} />
                </button>
            </div>
            {errorMessage}
        </Fragment>
    );
};

QuantityStepper.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => { }
};

export default QuantityStepper;
