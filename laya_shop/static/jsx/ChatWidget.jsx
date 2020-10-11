import React, { createContext, useState } from "react"
import ReactDOM from 'react-dom'
import { ThemeProvider, Box } from "theme-ui"
import  {ChatUserContextProvider} from './ChatWidget/UserContext'
import theme from './utils/theme'
import ChatRoom from './ChatWidget/ChatRooms'


const ChatWidget = () => {
    // Temporal Slug Data
    const [slug , setSlug] = useState('layashop')
    const [userPK] = useState(USER)
    console.log('Slug', slug)
    console.log('user',USER)
    return (
        <ThemeProvider theme={theme}> 
            <ChatUserContextProvider value={
                {userPk: userPK}
            }>
                <Box as='div'>
                <form onSubmit={e => e.preventDefault()}>
                    <input placeholder="slug" value={slug} type="text" name='slug' onChange={e => setSlug(e.target.value)}/>
                </form>
                </Box>
                <ChatRoom businessSlug={slug}></ChatRoom>
            </ChatUserContextProvider>
        </ThemeProvider>
    )
}

console.log('CHAT WIDGET')

const widgetContainer = document.getElementById('chat-widget')
ReactDOM.render(<ChatWidget/>,widgetContainer)