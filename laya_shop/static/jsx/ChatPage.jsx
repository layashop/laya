import React, { createContext, useState } from "react"
import {render} from 'react-dom'
import { ThemeProvider, Box } from "theme-ui"
import  {ChatUserContextProvider} from './ChatWidget/UserContext'
import theme from './utils/theme'
import ChatRoom from './ChatWidget/ChatRooms'
import ChatList from "./ChatWidget/ChatList"


const initialState = {
        slug: '',
        chatTitle : ''
    }

const ChatPage = () => {
    // Temporal Slug Data
    const [selectedChatRoom , setSlug] = useState(initialState)
    const [user] = useState(USER)
    
    console.log('Slug in Page', selectedChatRoom)
    console.log('user in Page',USER)


    const resetState = () => {
        setSlug(initialState)
    }

    return (
        <div style={{
            paddingTop : 200
        }}
        className="lg:mx"
        
>
    <div         className='bg-white border-blue-600 rounded border-2 border-opacity-25 flex w-full divide-x lg:w-8/12 '>
   <ThemeProvider theme={theme}> 
            <ChatUserContextProvider value={
                {user: user}
            }>
                <ChatList chatSelected={!!selectedChatRoom.slug} businessSlug={BUSINESS.slug} 
                setChatRoomSlug={setSlug} ></ChatList>
               { selectedChatRoom.slug ? <div className="divide-y w-full">
                    <div className="text-xl p-2 inline-block">
                        <span className="font-light flex-justify-start" onClick={resetState}>BACK</span>
        <h1 className="flex-grow text-center" >{selectedChatRoom.chatTitle}</h1>
                    </div>
                    <ChatRoom slug={selectedChatRoom.slug}></ChatRoom>
               </div> : null}
            </ChatUserContextProvider>
        </ThemeProvider>
    </div>
         
        </div>
    )
}


    const widgetContainer = document.getElementById('chat_app')


    render(<ChatPage/>,widgetContainer)
