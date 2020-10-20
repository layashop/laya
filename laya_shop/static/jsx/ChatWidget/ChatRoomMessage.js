import React, { useContext } from 'react'
import ChatUserContext from './UserContext'

const ChatRoomMessage = ({message}) => {
    const {user} = useContext(ChatUserContext)
    return <div className={`${ message.user === user.pk ? "bg-white text-gray-700 self-start" 
    : "bg-teal-600 text-white self-end"} w-2/3 h-auto p-2  my-2 rounded-md shadow mr-3`}>
        <div className="font-semibold">
            {message.sender_name}
        </div>
        <p className="break-words">
            {message.message}
        </p>
    </div>
}


export default ChatRoomMessage