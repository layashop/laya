import React, { memo , useEffect} from 'react'
import ChatRoomMessage from './ChatRoomMessage'
import compareMessageProps from './MessagePropsCompare'

const ChatRoomMessageOther = ({message, markAsSeen }) => {

    useEffect(()=>{
        console.log('Marking for Seen', !message.seen)
        if(message.send_verifier && !message.seen ){
            markAsSeen(message.id)
        }
    },[message])
    return <ChatRoomMessage message={message}/>
} 

export default ChatRoomMessageOther