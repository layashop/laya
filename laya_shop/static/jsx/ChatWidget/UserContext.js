import {createContext} from 'react'

const ChatUserContext = createContext({
    userPk : undefined
})

const ChatUserContextProvider = ChatUserContext.Provider

export default ChatUserContext
export {
ChatUserContextProvider,
ChatUserContext
}