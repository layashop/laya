import React, {createContext, useState} from "react"
import {render} from 'react-dom'
import {ThemeProvider, Box} from "theme-ui"
import {ChatUserContextProvider} from './ChatWidget/UserContext'
import theme from './utils/theme'
import ChatRoom from './ChatWidget/ChatRooms'
import ChatList from "./ChatWidget/ChatList"
import IconResolver from "./ChatWidget/IconResolver";


const initialState = {
    slug: '',
    chatTitle: ''
}

const ChatPage = () => {
    // Temporal Slug Data
    const [businessId, setBusinessId] = useState(0)
    const [selectedChatRoom, setSlug] = useState(initialState)
    const [user] = useState(USER)

    console.log('Slug in Page', selectedChatRoom)
    console.log('user in Page', USER)


    const resetState = () => {
        setSlug(initialState)
        setBusinessId(0)
    }

    console.log(selectedChatRoom)

    console.log('business', businessId)

    return (
        <div className="lg:mx h-screen">
            <div className='bg-white flex w-full divide-x border-t-2 border-blue-500 border-opacity-50' style={{height: '90%'}}>
                <ThemeProvider theme={theme}>
                    <ChatUserContextProvider value={
                        {user: user}
                    }>
                        <ChatList chatSelected={!!selectedChatRoom.slug} businessSlug={BUSINESS.slug}
                                  setChatRoomSlug={setSlug}
                                  setBusinessId={setBusinessId}
                        />
                        {selectedChatRoom.slug ? <div className="divide-y w-full overflow-y-auto relative">
                            <div className="bg-white text-xl z-10 p-2 inline-block sticky top-0 w-full">
                                <span className="font-light text-blue-600 hover:bg-gray-200 p-1 pr-3 pb-2 cursor-pointer transition duration-100" onClick={resetState}><IconResolver icon="back"/>Regresar</span>
                                <h1 className="flex-grow ">{selectedChatRoom.chatTitle}</h1>
                            </div>
                            <ChatRoom slug={selectedChatRoom.slug} businessId={businessId}/>
                        </div> : null}
                    </ChatUserContextProvider>
                </ThemeProvider>
            </div>

        </div>
    )
}


const widgetContainer = document.getElementById('chat_app')


render(<ChatPage/>, widgetContainer)
