import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import ChatRoomMessage from './ChatRoomMessage'
import ChatUserContext from './UserContext'

const ChatRoomHistoricMessages = ({children, websocket, markAsSeen, }) => {
    const [sent, setSent] = useState(false)
    const {user} = useContext(ChatUserContext)
    useEffect(()=>{
        if(websocket && !sent){
                    console.log('On Layout Effect', websocket)

            markAsSeen(user.pk)
            setSent(true)
        }
        
    },[websocket, sent])

    return <>{children}</>
}


export default ChatRoomHistoricMessages