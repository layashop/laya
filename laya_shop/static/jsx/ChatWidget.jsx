import React, { createContext, useState } from "react"
import {render} from 'react-dom'
import { ThemeProvider, Box } from "theme-ui"
import  {ChatUserContextProvider} from './ChatWidget/UserContext'
import theme from './utils/theme'
import ChatRoom from './ChatWidget/ChatRooms'


const ChatWidget = () => {
    // Temporal Slug Data
    const [slug , setSlug] = useState(BUSINESS)
    const [userPK] = useState(USER)
    console.log('Slug', slug)
    console.log('user',USER)
    return (
        <ThemeProvider theme={theme}> 
            <ChatUserContextProvider value={
                {userPk: userPK}
            }>
                <ChatRoom businessSlug={slug}></ChatRoom>
            </ChatUserContextProvider>
        </ThemeProvider>
    )
}

console.log('CHAT WIDGET')

function renderWidget() {
    const widgetContainer = document.getElementById('chat-widget')
    render(<ChatWidget/>,widgetContainer)
}

const triggerButton = document.getElementById('trigger-chat')
triggerButton.addEventListener('click', renderWidget)