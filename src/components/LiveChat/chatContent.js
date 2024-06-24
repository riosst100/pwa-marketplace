import React from 'react';
import cn from 'classnames';

const chatContent = (props) => {
    const { chatData } = props;

    return (
        <>
            <div className='flex flex-col gap-2'>
                {chatData.map((chat) => {
                    return (
                        <div
                            className={cn(
                                'w-full max-w-[70%] flex flex-col gap-1',
                                chat.type === 'seller' ? 'self-start ' : 'self-end ',

                            )}
                        >
                            <div
                                className={cn(
                                    'w-full py-2 px-3 rounded-md flex flex-col',
                                    chat.type === 'seller' ? 'bg-gray-150 rounded-tl-none' : ' bg-[#D9D9D9] rounded-tr-none',

                                )}
                            >
                                {chat.message}
                            </div>
                            <span className='text-[12px] text-right block'>
                                {chat.timeStamp}
                            </span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default chatContent