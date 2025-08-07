import React from 'react';
import LiveChat from './liveChat';

const index = (props) => {

    const {
        open = false,
        setOpen = () => { },
    } = props;

    const dummyChat = [
        {
            "message": "May I help you",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "Yes",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "can i get a discount",
            "type": "buyer",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "you can redeem this code 'JunePlay'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
        {
            "message": "or this code 'collectfest'",
            "type": "seller",
            "timeStamp": "03-06-2024 2:59 pm"
        },
    ]

    const liveChatProps = {
        open,
        setOpen,
        chatData: dummyChat
    }

    return (
        <>
            <LiveChat {...liveChatProps} />
        </>
    )
}

export default index