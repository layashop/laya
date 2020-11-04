import React, { useContext, useEffect, useState} from 'react'
import FetchHook from '../utils/useFetch'
import ChatRoomItem from './ChatRoomItem'
import ChatUserContext from './UserContext'


const API = 'api/chat-app/chat-room/'

const ChatList = ({chatSelected, businessSlug, setChatRoomSlug}) => {
    const {userPk} = useContext(ChatUserContext)
    const [chatRooms, setChatRooms] = useState([])
    const [loading, error, sendRequest] = FetchHook.useFetch()
    

    useEffect(()=>{
        const queryData = async () => {
            let url = `http://localhost:8000/${API}?type=${businessSlug ? 'business' : 'user'}`
            if(businessSlug){
                url += `business_slug=${businessSlug}`
            }else{
                url += `user_id=${userPk}`
            }
            const data = await sendRequest(url)
            if(!data.error){
                setChatRooms(data)
            }
        }
        queryData()
    }, [])
    if(loading === FetchHook.LOADING) return <div>Loading...</div>
    
    console.log('ChatRoom', chatRooms)
    return (<div className={`divide-y divide-blue-400 divide-opacity-50 px-5  ${chatSelected ?'hidden md:block w-4/12' : 'w-full'}`  }>
        {chatRooms.map((chatRoom) => {
            return <ChatRoomItem   key={chatRoom.slug} businessSlug={businessSlug || chatRoom.business.slug}
            user={chatRoom.user} setChatRoomSlug={setChatRoomSlug}></ChatRoomItem>
        })}
        </div>)
} 

export default ChatList