import React, { createContext, useState } from "react"
import {render} from 'react-dom'
import { ThemeProvider, Box } from "theme-ui"
import  {ChatUserContextProvider} from './ChatWidget/UserContext'
import theme from './utils/theme'
import ChatRoom from './ChatWidget/ChatRooms'
import ChatList from "./ChatWidget/ChatList"


const ChatPage = () => {
    // Temporal Slug Data
    const [slug , setSlug] = useState()
    const [user] = useState(USER)
    console.log('Slug in Page', slug)
    console.log('user in Page',USER)
    return (
        <div style={{
            paddingTop : 200
        }}>
            <ThemeProvider theme={theme}> 
            <ChatUserContextProvider value={
                {user: user}
            }>
                <ChatList businessSlug={BUSINESS.slug} 
                setChatRoomSlug={setSlug} ></ChatList>
               { slug ?  <ChatRoom slug={slug}></ChatRoom> : null}
            </ChatUserContextProvider>
        </ThemeProvider>
        </div>
    )
}


    const widgetContainer = document.getElementById('chat_app')


    render(<ChatPage/>,widgetContainer)
