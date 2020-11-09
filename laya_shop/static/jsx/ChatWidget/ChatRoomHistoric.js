import React, { useContext, useLayoutEffect } from 'react'
import ChatRoomMessage from './ChatRoomMessage'
import ChatUserContext from './UserContext'

const ChatRoomHistoricMessages = ({children, websocket, markAsSeen}) => {
    const {user} = useContext(ChatUserContext)
    useLayoutEffect(()=>{
        if(websocket){
            markAsSeen(user.pk)
        }
        
    },[websocket])

    console.log(children)
    return <>{children}</>
}


export default React.memo(ChatRoomHistoricMessages)