import React, { memo, useEffect } from 'react'
import ChatRoomMessage from './ChatRoomMessage'
import compareMessageProps from './MessagePropsCompare'

const ChatRoomOwnMessage = ({message, edit, slug }) => {


    useEffect(()=>{

    },[])
    return <ChatRoomMessage message={message} slug={slug}/>
}

export default ChatRoomOwnMessage
