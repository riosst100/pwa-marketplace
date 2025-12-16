import React, { useMemo, useState, useEffect } from 'react';
import cn from 'classnames';
import ChatContent from '@riosst100/pwa-marketplace/src/components/LiveChat/chatContent';
import { useIntl } from 'react-intl';

const MessagesModal = ({
    isOpen,
    onClose,
    messages,
    seller,
    onReply,
    onDelete,
    onSend,
    loading
}) => {

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
        return [...threads].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }, [threads]);

    useEffect(() => {
        if (!isComposing && sortedThreads?.length) {
            const latest = sortedThreads[sortedThreads.length - 1];
            if (!selectedThread) {
                setSelectedThread(latest);
            } else {
                const stillThere = sortedThreads.find(t => t.message_id === selectedThread.message_id);
                if (!stillThere) {
                    setSelectedThread(latest);
                } else {
                    // Replace with the fresh thread data so new details from polling appear
                    setSelectedThread(stillThere);
                    if (selectLatestAfterSend) {
                        setSelectedThread(latest);
                        setSelectLatestAfterSend(false);
                    }
                }
            }
        }
    }, [sortedThreads, isComposing, selectedThread, selectLatestAfterSend]);

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

    if (!isOpen) return null;

    return (
        <div
            className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/30')}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className='bg-white rounded-[6px] shadow-lg w-full max-w-[500px] p-5'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-[18px] font-semibold'>Send Message</h3>
                    <button onClick={onClose} aria-label='Close' className='text-gray-600 text-[30px] hover:text-black'>×</button>
                </div>
                <div className='flex gap-4'>

                    {/* Detail percakapan */}
                    <div className='flex-1 flex flex-col'>
                        {/* Compose new message (shown only when composing OR when no thread exists) */}
                        
                        <form onSubmit={handleSubmitNewMessage} className='mb-3 rounded-[6px] p-1 flex flex-col gap-2'>
                            <div className='text-[13px] font-semibold flex items-center justify-between'>
                                <span>Send Message to {seller?.name}</span>
                                {/* {(sortedThreads.length > 0) && (
                                    <button
                                        type='button'
                                        onClick={() => setIsComposing(false)}
                                        className='text-[12px] px-2 py-1 rounded border text-gray-600 hover:bg-gray-50'
                                    >
                                        {formatMessage({ id: 'messages.compose.cancel', defaultMessage: 'Cancel' })}
                                    </button>
                                )} */}
                            </div>
                            <input
                                type='text'
                                className='border border-gray-100 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6E26]'
                                placeholder={formatMessage({ id: 'messages.compose.subjectPlaceholder', defaultMessage: 'Subject' })}
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                            />
                            <textarea
                                rows={3}
                                className='border border-gray-100 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6E26]'
                                placeholder={formatMessage({ id: 'messages.compose.contentPlaceholder', defaultMessage: 'Write a message to the seller…' })}
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                            <div className='flex justify-end'>
                                <button
                                    type='submit'
                                    className={cn('px-4 py-2 rounded-[6px] text-white disabled:opacity-50 disabled:cursor-not-allowed', isSendingNew ? 'bg-gray-500 text-gray-700' : 'bg-[#FF6E26]')}
                                    disabled={isSendingNew}
                                    aria-busy={isSendingNew}
                                >
                                    {isSendingNew
                                        ? formatMessage({ id: 'messages.compose.sending', defaultMessage: 'Sending Message...' })
                                        : formatMessage({ id: 'messages.compose.send', defaultMessage: 'Send Message' })}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesModal;