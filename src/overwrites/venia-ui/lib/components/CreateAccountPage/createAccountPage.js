import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './createAccountPage.module.css';
import cn from 'classnames';

const CreateAccountPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { createAccountProps } = useCreateAccountPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.signInRootContainer}>
            <div className={cn(classes.root, '!py-[60px]')}>
                <StoreTitle>
                    {formatMessage({
                        id: 'signInPage.title',
                        defaultMessage: 'Sign In'
                    })}
                </StoreTitle>
                <div className={cn(classes.leftContentContainer, '')}>
                    <div class="auth-left">
                        <img src="https://img.freepik.com/premium-vector/sign-up-concept-illustration_114360-7965.jpg?semt=ais_hybrid&w=740&q=80" width="50%" />
                        <p style={{
                            "fontSize": "20px",
                            "fontWeight": 500
                        }}>Create an account to start shopping or selling your collectibles.</p>
                    </div>
                </div>
            </div>
            <div className={classes.root}>
                <StoreTitle>
                    {formatMessage({
                        id: 'createAccountPage.title',
                        defaultMessage: 'Create an Account'
                    })}
                </StoreTitle>
                <div className={cn(classes.contentContainer, '!border !border-gray-100 !rounded-lg')}>
                    <CreateAccount {...createAccountProps} />
                </div>
            </div>
        </div>
    );
};

CreateAccountPage.defaultProps = {
    signedInRedirectUrl: '/',
    signInPageUrl: '/sign-in'
};

CreateAccountPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default CreateAccountPage;
