import React, {useContext, useEffect, userContext, useState} from 'react'
import { Box } from "theme-ui"
import ChatUserContext from './UserContext'

const API = 'localhost:8000'

const ChatRoom= ({businessSlug}) => {
    const {userPk} = useContext(ChatUserContext)
    const [chatSocket, setChatSocket] = useState()
    const [messageText , setMessageText] = useState('')
    const [chatLog, setChatLog] = useState([])
    const handleChange = e => setMessageText(e.target.value)
    const sendMessage = e =>  {
        e.preventDefault()
    }
    const addMessage = newMessage => {
        setChatLog([...chatLog, newMessage])
    }
    const checkConnection = () => {
        if(! chatSocket || chatSocket.readyState == WebSocket.CLOSED) createWSConnection()
    }

    const createWSConnection = () => {
         const ws = new WebSocket(`ws://${API}/ws/chat/${businessSlug}/${userPk}/`)
        ws.onopen = () => {
            console.log('Connected to WebSocket')
            setChatSocket(ws)
        }
        ws.onclose = e => {
            console.log('Connection Closed, attempting to reconnect', e.reason)
            setTimeout(checkConnection, )   
        }
        ws.onmessage = e => {
            const data = JSON.parse(e.data)
            addMessage(data.message)
        }
        ws.onerror = err => {
            console.error('Socket error:', err.message)
            ws.close()
        }
    }
    useEffect(()=>{
       if(userPk) createWSConnection()
       return () => {
           chatSocket?.close()
       }
    },[userPk])
    console.log(chatLog)
    return <Box as='div'>
        <Box as='div'>
            Old Messages
        </Box>
        <Box as='hr'></Box>
        <form onSubmit={sendMessage}>
            <input placeholder='Message...' value={messageText} onChange={handleChange}></input>
        </form>
    </Box>
}

export default ChatRoom