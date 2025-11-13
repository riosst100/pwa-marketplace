import React, { useRef, useEffect } from 'react';
import cn from 'classnames';

const chatContent = (props) => {
    const { chatData } = props;


        const orderedChatData = [...chatData].reverse();
        const messagesContainerRef = useRef(null);

        useEffect(() => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
        }, [orderedChatData]);

        return (
            <>
                <div
                    ref={messagesContainerRef}
                    className='flex flex-col gap-2 w-full overflow-y-auto max-h-[400px]'
                >
                    {orderedChatData.map((chat, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                'w-fit max-w-[70%] flex flex-col gap-1',
                                chat.type === 'seller' ? 'self-start ' : 'self-end items-end',
                            )}
                        >
                            {chat.senderName && (
                                <span className='text-[12px] text-gray-500 font-semibold mb-[-2px]'>
                                    {chat.senderName}
                                </span>
                            )}
                            <div
                                className={cn(
                                    'w-fit py-2 px-3 rounded-md flex flex-col',
                                    chat.type === 'seller' ? 'bg-gray-150 rounded-tl-none' : ' bg-[#D9D9D9] rounded-tr-none',
                                )}
                            >
                                {chat.message}
                            </div>
                            <span className='text-[12px] text-right block'>
                                {chat.timeStamp}
                            </span>
                        </div>
                    ))}
                </div>
            </>
        )
}

export default chatContent