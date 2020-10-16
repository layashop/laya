import React from 'react'

const ChatRoomMessage = ({message}) => {


    return <div>
        <div>
            {message.senderName}
        </div>
        <div>
            {message.message}
        </div>
    </div>
}


export default ChatRoomMessage