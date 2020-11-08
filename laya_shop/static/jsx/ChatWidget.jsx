import React, { createContext, useState } from "react"
import {render, unmountComponentAtNode} from 'react-dom'
import  {ChatUserContextProvider} from './ChatWidget/UserContext'
import ChatRoom from './ChatWidget/ChatRooms'



function renderWidget() {
    const widgetContainer = document.getElementById('chat-widget')
    render(<ChatWidget/>,widgetContainer)
}

function removeComponent () {
    const widgetContainer = document.getElementById('chat-widget')
    unmountComponentAtNode(widgetContainer)
}

const ChatWidget = () => {
    // Temporal Slug Data
    const [slug , setSlug] = useState(`${BUSINESS}-${USER.pk}`)
    const [user] = useState(USER)

    const onClick = (e) => {
        removeComponent()
    }
    return (
            <ChatUserContextProvider value={
                {user: user}
            }>
                {/*  fixed bottom-0 right-0 */}
                <div as="div"
                    className="chat-widget fixed bottom-0 sm:right-0 flex justify-center sm:justify-end items-end z-10  w-full h-screen sm:bg-opacity-0 bg-black bg-opacity-25"
                    onClick={onClick}
                >
                    <div onClick={e => e.stopPropagation()} className="widget-container flex flex-col shadow-lg sm:w-2/3 md:w-1/3 lg:w-1/4 ">
                        <div className="flex justify-between items-center text-white p-2 bg-teal-500 border shadow-lg w-full">
                            <h2>Chat</h2>
                             <div onClick={onClick} className="close-chat bg-blue-500 hover:bg-blue-600 text-white mb-1 w-10 flex justify-center items-center px-2 py-1 rounded self-end cursor-pointer">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                                <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                                </svg>
                            </div>
                        </div>
                        <ChatRoom slug={slug}></ChatRoom>
                    </div>

                </div>
            </ChatUserContextProvider>
    )
}



const triggerButton = document.getElementById('trigger-chat')
triggerButton.addEventListener('click', renderWidget)
