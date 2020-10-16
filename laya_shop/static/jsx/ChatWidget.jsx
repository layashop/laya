import React, { createContext, useState } from "react"
import {render} from 'react-dom'
import { ThemeProvider, Box } from "theme-ui"
import  {ChatUserContextProvider} from './ChatWidget/UserContext'
import theme from './utils/theme'
import ChatRoom from './ChatWidget/ChatRooms'


const ChatWidget = () => {
    // Temporal Slug Data
    const [slug , setSlug] = useState(`${BUSINESS}-${USER.pk}`)
    const [user] = useState(USER)
   
    return (
        <ThemeProvider theme={theme}> 
            <ChatUserContextProvider value={
                {user: user}
            }>
                <ChatRoom slug={slug}></ChatRoom>
            </ChatUserContextProvider>
        </ThemeProvider>
    )
}


function renderWidget() {
    const widgetContainer = document.getElementById('chat-widget')
    render(<ChatWidget/>,widgetContainer)
}

const triggerButton = document.getElementById('trigger-chat')
triggerButton.addEventListener('click', renderWidget)