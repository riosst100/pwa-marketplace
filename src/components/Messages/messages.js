import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

// import { useMessages } from '@riosst100/pwa-marketplace/src/talons/Messages/useMessages';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './messages.module.css';
import cn from 'classnames';
import React, { useMemo, useState, useEffect } from 'react';
import ChatContent from '@riosst100/pwa-marketplace/src/components/LiveChat/chatContent';
import { Link } from "react-router-dom";
import { Star1, Verify, Sms, Message, Shop, ArrowUp2 } from 'iconsax-react';

const Messages = props => {
    const { 
    messages,
    seller,
    onReply,
    onDelete,
    onSend,
    loading } = props;
    const classes = useStyle(defaultClasses, props.classes);
    // const { becomeSellerProps } = useMessages(props);
    const { formatMessage } = useIntl();
    
        const [selectedThread, setSelectedThread] = useState(null);
        const [replyText, setReplyText] = useState('');
        const [newSubject, setNewSubject] = useState('');
        const [newContent, setNewContent] = useState('');
        const [isComposing, setIsComposing] = useState(false);
        const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
        const [selectLatestAfterSend, setSelectLatestAfterSend] = useState(false);
        const [isSendingNew, setIsSendingNew] = useState(false);
        const [isReplying, setIsReplying] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);
    
        const renderStatusBadge = (statusValue) => {
            const s = Number(statusValue);
            const map = {
                0: { label: formatMessage({ id: 'messages.status.closed', defaultMessage: 'Closed' }), bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
                1: { label: formatMessage({ id: 'messages.status.open', defaultMessage: 'Open' }), bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
                2: { label: formatMessage({ id: 'messages.status.processing', defaultMessage: 'Processing' }), bg: 'bg-yellow-300/20', text: 'text-yellow-300', dot: 'bg-yellow-300' },
                3: { label: formatMessage({ id: 'messages.status.done', defaultMessage: 'Done' }), bg: 'bg-[#3d84ff1a]', text: 'text-[#3d84ff]', dot: 'bg-[#3d84ff]' }
            };
            const conf = map[s] || { label: 'Unknown', bg: 'bg-gray-200', text: 'text-gray-700', dot: 'bg-gray-500' };
            return (
                <span className={`inline-flex items-center justify-center gap-1 px-2 h-[24px] rounded-full text-[12px] font-medium ${conf.bg} ${conf.text} whitespace-nowrap`}> 
                    <span className={`inline-block w-[8px] h-[8px] rounded-full ${conf.dot}`}></span>
                    {conf.label}
                </span>
            );
        };
    
        // Filter pesan yang terkait seller ini (perkiraan berdasarkan id terkait)
        const threads = useMemo(() => {
            const items = messages?.items || [];
            if (!seller?.seller_id) return items;
            return items.filter(t =>
                t?.owner_id === seller.seller_id ||
                t?.receiver_id === seller.seller_id ||
                t?.sender_id === seller.seller_id
            );
        }, [messages, seller]);
    
        const sortedThreads = useMemo(() => {
            return [...threads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }, [threads]);

        const { location } = globalThis;

        const query = new URLSearchParams(location.search);
        

        // console.log('query',query)
        // console.log('messageId',messageId)
    
        useEffect(() => {
            const messageId = query.get('id') || null;
            console.log('query',query)
        console.log('messageId',messageId)
    
            if (messageId && sortedThreads?.length) {
                const selectedThread = sortedThreads.find(t => t.message_id == messageId);
                console.log('sortedThreads',sortedThreads)
                console.log('selectedThread',selectedThread)
                if (selectedThread) {
                    console.log('selectedThread',selectedThread)
                    setSelectedThread(selectedThread);
                }
            }
        }, [sortedThreads, query]);
    
        // Tandai sudah pernah load minimal sekali untuk mencegah flicker
        useEffect(() => {
            if (threads.length > 0 || (!loading && messages)) {
                setHasLoadedOnce(true);
            }
        }, [threads.length, loading, messages]);
    
        const chatData = useMemo(() => {
            const details = selectedThread?.details?.items || [];
            const sorted = [...details].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            const opening = selectedThread ? [{
                message: selectedThread.description,
                senderName: selectedThread.sender_name,
                timeStamp: selectedThread.created_at ? new Date(selectedThread.created_at).toLocaleString() : '',
                type: selectedThread.sender_name === seller?.name ? 'seller' : 'customer'
            }] : [];
            const mapped = sorted.map(d => ({
                message: d.content,
                senderName: d.sender_name,
                timeStamp: new Date(d.created_at).toLocaleString(),
                type: d.sender_name === seller?.name ? 'seller' : 'customer'
            }));
            return [...opening, ...mapped];
        }, [selectedThread, seller]);
    
        const handleSubmitReply = async (e) => {
            e.preventDefault();
            if (!selectedThread?.message_id || !replyText.trim()) return;
            try {
                setIsReplying(true);
                const res = await onReply({ message_id: selectedThread.message_id, content: replyText.trim() });
                // Optimistic local append so the reply appears instantly
                const newDetail = {
                    content: res?.content || replyText.trim(),
                    sender_name: res?.sender_name || selectedThread?.sender_name || 'You',
                    sender_email: res?.sender_email || '',
                    receiver_name: res?.receiver_name || '',
                    is_read: true,
                    created_at: res?.created_at || new Date().toISOString()
                };
                const nextThread = {
                    ...selectedThread,
                    details: {
                        ...selectedThread.details,
                        items: [...(selectedThread.details?.items || []), newDetail],
                        total_count: (selectedThread.details?.total_count || 0) + 1
                    }
                };
                setSelectedThread(nextThread);
            } finally {
                setIsReplying(false);
            }
            setReplyText('');
        };
    
        const handleDeleteThread = async () => {
            if (!selectedThread?.message_id) return;
            try {
                setIsDeleting(true);
                await onDelete({ id: selectedThread.message_id });
            } finally {
                setIsDeleting(false);
            }
        };
    
        const handleSubmitNewMessage = async (e) => {
            e.preventDefault();
            if (!newSubject.trim() || !newContent.trim()) return;
            try {
                setIsSendingNew(true);
                await onSend({ subject: newSubject.trim(), content: newContent.trim(), seller_url: seller?.url_key });
            } finally {
                setIsSendingNew(false);
            }
            setNewSubject('');
            setNewContent('');
            setIsComposing(false);
            setSelectLatestAfterSend(true);
        };


        

    return (
        <>
            <div className={cn(classes.leftContent, '')}>
                <StoreTitle>
                    {formatMessage({
                        id: 'messagesPage.title',
                        defaultMessage: 'Messages'
                    })}
                </StoreTitle>
                <div className={cn(classes.leftContentContainer, 'border !border-gray-100 lg_rounded-md !rounded-lg')}>
                    <div class="auth-left">
                        <div className='text-[16px] px-3 py-3 border-gray-100 border-b font-medium flex items-center justify-between'>
                            <span>{formatMessage({ id: 'messages.sidebar.title', defaultMessage: 'Messages' })}</span>
                        </div>
                        <div className='max-h-[420px] overflow-y-auto'>
                            {(!hasLoadedOnce && loading) ? (
                                <div className='p-3 text-sm text-gray-500'>{formatMessage({ id: 'messages.loading', defaultMessage: 'Loading…' })}</div>
                            ) :  !sortedThreads || sortedThreads.length === 0 ? (
                                <div className={cn(classes.noMessages, 'text-sm text-gray-500')}>{formatMessage({ id: 'messages.detail.noMessages', defaultMessage: 'No messages yet.' })}</div>
                            ) : (
                                sortedThreads && sortedThreads.length && sortedThreads.map(t => 
                                    // console.log('fffff',t)
                                    <div>
                                        <hr className="!border-gray-100" style={{"width": "100%"}} />
                                        <button
                                            key={t.message_id}
                                            onClick={() => setSelectedThread(t)}
                                            className={cn('w-full text-left px-3 py-2 border-b hover:bg-gray-50',
                                                selectedThread?.message_id === t.message_id && 'bg-gray-100')}
                                        >
                                            <div className='flex items-center justify-between gap-2'>
                                                <div style={{"color": "#f76b1c"}}className='text-[12px] font-semibold line-clamp-1'>{t.seller ? t.seller.name : 'Unknown Seller' }</div>
                                                {/* <div className='text-[12px] flex-shrink-0'>
                                                    {renderStatusBadge(t.status)}
                                                </div> */}
                                            </div>
                                            <div className='flex items-center justify-between gap-2'>
                                                <div className='text-[12px] line-clamp-1'>Subject: {t.subject || formatMessage({ id: 'messages.noSubject', defaultMessage: 'No Subject' })}</div>
                                                {/* <div className='text-[12px] flex-shrink-0'>
                                                    {renderStatusBadge(t.status)}
                                                </div> */}
                                            </div>
                                            <div className='text-[11px] text-gray-500 mt-1'>
                                                {t.details.total_count ? t.details.items[t.details.items.length-1].content : t.description}
                                            </div>
                                            <div className='text-[10px] text-gray-500 mt-2'>{new Date(t.created_at).toLocaleString()}</div>
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.root}>
                <div style={{"padding": "20px"}} className="lg_border-2 lg_border-solid lg_border-subtle lg_rounded-md !border !border-gray-100 p-6 !rounded-lg">
                    {/* Compose new message (shown only when composing OR when no thread exists) */}
                        {sortedThreads.length > 0 && (
                        <div className='flex items-center justify-between mb-2'>
                            {selectedThread && (
                                <>
                                    <div style={{"textAlign": "left"}}>
                                        {selectedThread.seller && <Link to={"/seller/"+selectedThread.seller.url_key}>
                                            {/* <div class="flex items-center justify-center gap-[10px] relative">
                                                <Shop color="#f76b1c" size={14} variant="Outline" className='stroke-[#f76b1c]' />
                                                <div class="relative xs_hidden lg_flex w-fit text-[12px] text-[#f76b1c] text-[14px] tracking-[0] leading-[15px] whitespace-nowrap">
                                                    Visit Store
                                                </div>
                                            </div> */}
                                            <div style={{"color": "#f76b1c"}}className='text-[14px] font-semibold line-clamp-1'>{selectedThread.seller ? selectedThread.seller.name : 'Unknown Seller' }</div>
                                        </Link>}
                                        <div className='mt-3 mb-1 text-[12px]'>Subject: {selectedThread?.subject || formatMessage({ id: 'messages.noSubject', defaultMessage: 'No Subject' })}</div>
                                        {/* <div className='text-[12px] text-gray-600 flex items-center gap-2'>
                                            <span>{formatMessage({ id: 'messages.detail.status', defaultMessage: 'Status:' })}</span>
                                            {selectedThread && renderStatusBadge(selectedThread.status)}
                                        </div> */}
                                    </div>
                                    <button
                                        onClick={handleDeleteThread}
                                        disabled={isDeleting}
                                        className='text-[12px] px-3 py-1 rounded border text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                                    >
                                        {isDeleting && (
                                            <span className='w-3 h-3 border-2 border-red-200 border-t-red-500 rounded-full animate-spin' aria-hidden='true'></span>
                                        )}
                                        {isDeleting
                                            ? formatMessage({ id: 'messages.detail.deleting', defaultMessage: 'Deleting...' })
                                            : formatMessage({ id: 'messages.detail.delete', defaultMessage: 'Delete Message' })}
                                    </button>
                                </>
                            )}
                        </div>
                        )}
                        {sortedThreads.length > 0 && selectedThread ? (
                            <div className='!border-gray-100 border rounded-[6px] p-3 flex-1 min-h-[320px]'>
                                <ChatContent chatData={chatData} />
                            </div>
                        ) : (
                            <div className={classes.noConversationContainer}>
                                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-message-illustration-svg-download-png-8593289.png" style={{"width":"20%"}}/>
                                <div className='text-sm text-gray-500'>{formatMessage({ id: 'messages.detail.noConversation', defaultMessage: 'Select a message to view the conversation.' })}</div>
                            </div>
                        )}
                        {sortedThreads.length > 0 && selectedThread && (
                        <form onSubmit={handleSubmitReply} className='mt-3 flex gap-2'>
                            {(() => {
                                const statusNum = Number(selectedThread.status);
                                const isReplyEnabled = statusNum === 1 || statusNum === 2;
                                const disabledReason = statusNum === 0
                                    ? formatMessage({ id: 'messages.reply.disabled.closed', defaultMessage: 'Conversation closed' })
                                    : statusNum === 3
                                    ? formatMessage({ id: 'messages.reply.disabled.done', defaultMessage: 'Conversation finished' })
                                    : formatMessage({ id: 'messages.reply.disabled.generic', defaultMessage: 'Cannot send a reply' });
                                return (
                                    <>
                                        <input
                                            type='text'
                                            className='flex-1 !border-gray-100 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6E26] disabled:bg-gray-100 disabled:text-gray-500'
                                            placeholder={isReplyEnabled ? formatMessage({ id: 'messages.reply.placeholder', defaultMessage: 'Write a reply…' }) : disabledReason}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            disabled={!isReplyEnabled}
                                            title={!isReplyEnabled ? disabledReason : undefined}
                                            aria-disabled={!isReplyEnabled}
                                        />
                                        <button
                                            type='submit'
                                            disabled={!isReplyEnabled || isReplying}
                                            title={!isReplyEnabled ? disabledReason : undefined}
                                            className={cn('px-4 py-2 rounded-[6px] text-white disabled:opacity-50 disabled:cursor-not-allowed', isReplying ? 'bg-gray-500 text-gray-700' : 'bg-[#FF6E26]')}
                                            aria-busy={isReplying}
                                        >
                                            {isReplying
                                                ? formatMessage({ id: 'messages.reply.sending', defaultMessage: 'Sending...' })
                                                : formatMessage({ id: 'messages.reply.send', defaultMessage: 'Send' })}
                                        </button>
                                    </>
                                );
                            })()}
                        </form>
                        )}
                </div>
            </div>
        </>
    )
}

export default Messages;

Messages.defaultProps = {
    signedInRedirectUrl: '/messages',
    signInPageUrl: '/sign-in'
};

Messages.propTypes = {
    classes: shape({
        root: string
    }),
    signedInRedirectUrl: string
};
