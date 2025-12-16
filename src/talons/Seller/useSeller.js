import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import { useLocation, useHistory } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useIntl } from 'react-intl';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './seller.gql';

export const useSeller = props => {
    const { mapSeller } = props;

    const { formatMessage } = useIntl();

    const history = useHistory();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getStoreConfigData,
        getSellerDetailQuery,
        getCouponCodeQuery,
        getCustomerSellerMessages,
        customerSendMessageMutation,
        customerReplyMessageMutation,
        customerDeleteMessageMutation
    } = operations;
    const { pathname } = useLocation();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [, { addToast }] = useToasts();

    const slug = pathname.split('/')[2];
    const productUrlSuffix = storeConfigData?.storeConfig?.product_url_suffix;
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const getOtherInfo = true;
    const getProducts = true;

    const { error, loading, data } = useQuery(getSellerDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            urlKey,
            getOtherInfo,
            getProducts
        }
    });

    const {
        data: couponData,
        error: couponError,
        loading: couponLoading
    } = useQuery(getCouponCodeQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            sellerUrl: urlKey,
            pageSize: 20,
            currentPage: 1,
            filters: {
                is_public: {
                    eq: '1'
                }
            }
        },
        skip: !urlKey
    });

    const isBackgroundLoading = !!data && loading;

    const seller = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const seller = data.sellerByUrl;

        if (!seller) {
            return null;
        }

        return mapSeller(seller);
    }, [data, mapSeller, urlKey]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    const favoriteSellerOptions = useMemo(() => {
        const options = {
            seller_id: seller?.seller_id
        };

        return options;
    }, [seller]);

    const favoriteSellerButtonProps = {
        buttonText: '',
        item: favoriteSellerOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    // Messages state
    const [messageListVars, setMessageListVars] = useState({
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
        skip: !storeConfigData,
        variables: messageListVars,
        pollInterval: 10000,
        notifyOnNetworkStatusChange: true
    });

    const [sendMessage, { loading: sendLoading }] = useMutation(customerSendMessageMutation);
    const [replyMessage, { loading: replyLoading }] = useMutation(customerReplyMessageMutation);
    const [deleteMessage, { loading: deleteLoading }] = useMutation(customerDeleteMessageMutation);

    const handleSendMessage = useCallback(async ({ subject, content, seller_url }) => {
        const input = {
            subject,
            content,
            seller_url
        };
        const result = await sendMessage({ variables: { input }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'messages.messageSent',
                defaultMessage: 'Message sent successfully.'
            }),
            timeout: 3000
        });
        if (result) {
            var messageId = result?.data?.customerSendMessage.message_id;
            history.push('/messages?id=' + messageId);
        }
        return result?.data?.customerSendMessage;
    }, [sendMessage, refetchMessages, addToast, formatMessage]);

    const handleReplyMessage = useCallback(async ({ message_id, content }) => {
        const input = {
            message_id,
            content
        };
        const result = await replyMessage({ variables: { input }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'messages.replySent',
                defaultMessage: 'Reply sent successfully.'
            }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
        return result?.data?.customerReplyMessage;
    }, [replyMessage, refetchMessages, addToast, formatMessage]);

    const handleDeleteMessage = useCallback(async ({ id }) => {
        await deleteMessage({ variables: { id }, refetchQueries: [{ query: getCustomerSellerMessages, variables: messageListVars }] });
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'messages.messageDeleted',
                defaultMessage: 'Message deleted successfully.'
            }),
            timeout: 3000
        });
        await refetchMessages({ fetchPolicy: 'network-only' });
    }, [deleteMessage, refetchMessages, addToast, formatMessage]);

    return {
        error,
        loading,
        seller,
        favoriteSellerButtonProps,
        couponData,
        couponError,
        couponLoading,
        // messages
        messages: messagesData?.customer?.sellerMessages,
        messagesLoading,
        messagesError,
        setMessageListVars,
        sendLoading,
        replyLoading,
        deleteLoading,
        handleSendMessage,
        handleReplyMessage,
        handleDeleteMessage
    };
};
