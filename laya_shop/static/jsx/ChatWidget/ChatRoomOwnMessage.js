import React, { memo, useEffect } from 'react'
import ChatRoomMessage from './ChatRoomMessage'
import compareMessageProps from './MessagePropsCompare'

const ChatRoomOwnMessage = ({message, edit, }) => {


    useEffect(()=>{

    },[])
    return <ChatRoomMessage message={message}/>
} 

export default memo(ChatRoomOwnMessage, compareMessageProps)