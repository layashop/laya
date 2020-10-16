import React, { useContext } from 'react'
import ChatUserContext from './UserContext'

const ChatRoomMessage = ({message}) => {
    const {user} = useContext(ChatUserContext)
    console.log('User',user)
    console.log('Message', message.userId  )
    console.log('Is from User', message.userId === user.pk )
    return <div className={`${ message.userId === user.pk ? "bg-white text-gray-700 self-start" 
    : "bg-teal-600 text-white self-end"} w-2/3 h-auto p-2  my-2 rounded-md shadow mr-3`}>
        <div className="font-semibold">
            {message.senderName}
        </div>
        <p className="break-words">
            {message.message}
        </p>
    </div>
}


export default ChatRoomMessage