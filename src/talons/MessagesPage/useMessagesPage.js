import { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './messagesPage.gql';
import { useQuery, useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine/lib';
import { FormattedMessage, useIntl } from 'react-intl';

export const useMessagesPage = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, null);

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const {
        getCustomerSellerMessages,
        customerSendMessageMutation,
        customerReplyMessageMutation,
        customerDeleteMessageMutation
    } = operations;

    const [messageListVars] = useState({
        pageSize: 500,
        currentPage: 1,
        filter: undefined,
        sort: undefined
    });

    const {
        data: messagesData,
        loading: messagesLoading,
        error: messagesError,
        refetch: refetchMessages
    } = useQuery(getCustomerSellerMessages, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only',
        variables: messageListVars,
        pollInterval: 10000,
        notifyOnNetworkStatusChange: true
    });

    const [sendMessage] = useMutation(customerSendMessageMutation);
    const [replyMessage] = useMutation(customerReplyMessageMutation);
    const [deleteMessage] = useMutation(customerDeleteMessageMutation);

    const handleSendMessage = async ({ subject, content, seller_url }) => {
        const input = { subject, content, seller_url };
        const result = await sendMessage({ variables: { input }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({ id: 'messages.messageSent', defaultMessage: 'Message sent successfully.' }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
        return result?.data?.customerSendMessage;
    };

    const handleReplyMessage = async ({ message_id, content }) => {
        const input = { message_id, content };
        const result = await replyMessage({ variables: { input }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({ id: 'messages.replySent', defaultMessage: 'Reply sent successfully.' }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
        return result?.data?.customerReplyMessage;
    };

    const handleDeleteMessage = async ({ id }) => {
        await deleteMessage({ variables: { id }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({ id: 'messages.messageDeleted', defaultMessage: 'Message deleted successfully.' }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
    };

    return {
        messagesData,
        messagesLoading,
        handleReplyMessage,
        handleDeleteMessage,
        handleSendMessage
    };
};
