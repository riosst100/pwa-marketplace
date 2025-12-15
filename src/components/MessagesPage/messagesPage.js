import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useMessagesPage } from '@riosst100/pwa-marketplace/src/talons/MessagesPage/useMessagesPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './messagesPage.module.css';
import cn from 'classnames';
import React, { useMemo, useState, useEffect } from 'react';
import Messages from '@riosst100/pwa-marketplace/src/components/Messages';

const MessagesPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { messagesData, messagesLoading, handleReplyMessage, handleDeleteMessage, handleSendMessage } = useMessagesPage(props);
    const { formatMessage } = useIntl();

    return (
        <>
            <StoreTitle>
                {formatMessage({
                    id: 'messagesPage.title',
                    defaultMessage: 'Messages'
                })}
            </StoreTitle>
            <div className={classes.rootContainer}>
                <Messages
                    messages={messagesData?.customer?.sellerMessages}
                    onReply={handleReplyMessage}
                    onDelete={handleDeleteMessage}
                    onSend={handleSendMessage}
                    loading={messagesLoading}
                />
            </div>
        </>
    )
}

export default MessagesPage;

MessagesPage.defaultProps = {
    signedInRedirectUrl: '/messages',
    signInPageUrl: '/sign-in'
};

MessagesPage.propTypes = {
    classes: shape({
        root: string
    }),
    signedInRedirectUrl: string
};
