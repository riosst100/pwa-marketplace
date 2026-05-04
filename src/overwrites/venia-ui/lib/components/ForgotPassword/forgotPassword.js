import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';

import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword';

import FormErrors from '@magento/venia-ui/lib/components/FormError';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';

import forgotPasswordOperations from '@magento/venia-ui/lib/components/ForgotPassword/forgotPassword.gql';

import defaultClasses from './forgotPassword.module.css';

const ForgotPassword = props => {
    const { initialValues, onCancel } = props;

    const { formatMessage } = useIntl();
    const talonProps = useForgotPassword({
        onCancel,
        ...forgotPasswordOperations
    });

    const {
        forgotPasswordEmail,
        formErrors,
        handleCancel,
        handleFormSubmit,
        hasCompleted,
        isResettingPassword,
        recaptchaWidgetProps
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const INSTRUCTIONS = formatMessage({
        id: 'forgotPassword.instructions',
        defaultMessage:
            'Please enter the email address associated with the account.'
    });
    const children = hasCompleted ? (
        <FormSubmissionSuccessful email={forgotPasswordEmail} />
    ) : (
        <Fragment>
            <h1 data-cy="ForgotPassword-title" className={classes.title}>
                <FormattedMessage
                    id={'forgotPassword.recoverPasswordText'}
                    defaultMessage={'Reset Password'}
                />
            </h1>
            <p
                data-cy="ForgotPassword-instructions"
                className={classes.instructions}
            >
                {INSTRUCTIONS}
            </p>
            <ForgotPasswordForm
                initialValues={initialValues}
                isResettingPassword={isResettingPassword}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                recaptchaWidgetProps={recaptchaWidgetProps}
            />
            <FormErrors errors={formErrors} />
        </Fragment>
    );

    return <div className={classes.root}>{children}</div>;
};

export default ForgotPassword;

ForgotPassword.propTypes = {
    classes: shape({
        instructions: string,
        root: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func
};

ForgotPassword.defaultProps = {
    onCancel: () => {}
};
