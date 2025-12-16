import React from 'react';
import { FormattedMessage } from 'react-intl';
import cn from 'classnames';
import { Messages3 } from 'iconsax-react';
import ChatContent from './chatContent';
import { Send } from 'iconsax-react';
import Button from '@magento/venia-ui/lib/components/Button';
import Tabs from '@riosst100/pwa-marketplace/src/components/commons/Tabs';
import SignIn from '@magento/venia-ui/lib/components/SignIn';
import { Link } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const ChatContentComponent = (props) => {
    const { chatData } = props;
    return (
        <>
            <div className='h-[calc(100%-76px)] mb-4 overflow-auto chat-container pr-1'>
                <ChatContent chatData={chatData} />
            </div>
            <div className='flex gap-2'>
                <textarea
                    className='w-full focus-visible_outline-none border border-gray-100 p-1 rounded-md'
                    cols={5}
                />
                <Button
                    priority='high'
                    classes={{
                        content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                    }}
                    className={cn(
                        "bg-blue-600 px-6 py-2 rounded-full text-white border ",
                        "border-blue-600 hover_bg-blue-700 hover_border-blue-700 focus-visible_outline-none"
                    )}
                >
                    <Send
                        size="24"
                        className='text-white'
                    />
                </Button>
            </div>
        </>
    )
}

const LoginComponent = () => (
    <>
        <SignIn
            classes={{
                root: 'gap-sm grid justify-items-stretch xs_!p-0',
                title: 'hidden',
            }}
            showSocialLogin={false}
        />
        <Link
            to={'/sign-in'}
            className={cn(
                // 'text-[16px] text-blue-600 font-medium w-full border border-blue-600 block py-2 px-6 rounded-full text-center mt-4',
                // 'hover_bg-blue-600 hover_text-white'
                'text-blue-600 underline mt-2 block text-center'
            )}
        >
            <FormattedMessage
                id={'liveChat.otherMethod'}
                defaultMessage={"Try Other Method"}
            />
        </Link>
    </>
)

const liveChat = (props) => {
    const { open, setOpen, chatData } = props;
    const [{ isSignedIn }] = useUserContext();

    return (
        <>
            <div
                className={cn(
                    'flex flex-col w-full max-w-[150px] fixed z-50',
                    'bottom-[30px] right-[30px]'
                )}
            >
                <Link
                    className='bg-darkblue-900 p-4 px-6 rounded-[40px] cursor-pointer flex justify-between items-center'
                    to={'/messages'}
                >
                    <span className='text-white font-medium'>
                        <FormattedMessage
                            id={'chat.messageButton'}
                            defaultMessage={
                                'Messages'
                            }
                        />
                    </span>
                    <span>
                        <Messages3
                            size="24"
                            className={
                                cn(
                                    'transition-all text-white'
                                )
                            }
                        />
                    </span>

                </Link>
            </div>
            <style jsx="true">
                {`
                    .chat-container::-webkit-scrollbar {
                        width: 8px;
                        border-radius: 5px;
                    }
                    
                    .chat-container::-webkit-scrollbar-track {
                        background: #f2f2f2;
                        border-radius: 8px;
                    }
                    
                    .chat-container::-webkit-scrollbar-thumb {
                        background-color: #c3c3c3;
                        border-radius: 20px;
                        border: 2px solid #f2f2f2;
                    }
                `}
            </style>
        </>
    )
}

export default liveChat