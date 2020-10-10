import React, { createContext, useState } from "react"
import ReactDOM from 'react-dom'
import { ThemeProvider, Box } from "theme-ui"
import theme from './utils/theme'

const ChatUserContext = createContext({
    userPk : undefined
})

const ChatWidget = () => {
    // Temporal Slug Data
    const [slug , setSlug] = useState()
    const userPK = useState(USER)
    return (
        <ThemeProvider theme={theme}> 
            <ChatUserContext.Provider value={
                {userPk: userPK}
            }>
                <Box as='div'>
                <form >
                    <input value={slug} type="text" name='slug' onChange={e => setSlug(e.target.value)}/>
                </form>
            </Box>
            </ChatUserContext.Provider>
        </ThemeProvider>
    )
}


const widgetContainer = document.getElementById('chat-widget')
ReactDOM.render(<ChatWidget/>,widgetContainer)