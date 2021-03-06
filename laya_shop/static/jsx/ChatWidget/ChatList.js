import React, { useContext, useEffect, useState} from 'react'
import FetchHook from '../utils/useFetch'
import ChatRoomItem from './ChatRoomItem'
import ChatUserContext from './UserContext'


const API = 'api/chat-app/chat-room/'

const ChatList = ({chatSelected, businessSlug, setChatRoomSlug, setBusinessId}) => {
    const {user} = useContext(ChatUserContext)
    const [chatRooms, setChatRooms] = useState([])
    const [loading, error, sendRequest] = FetchHook.useFetch()


    useEffect(()=>{
        const queryData = async () => {
            let url = `http://localhost:8000/${API}?type=${businessSlug ? 'business' : 'user'}`
            if(businessSlug){
                url += `&business_slug=${businessSlug}`
            }else{
                url += `&user=${user.pk}`
            }
            const data = await sendRequest(url)
            if(!data.error){
                setChatRooms(data)
                if(window.location.hash) {
                    setChatRoomSlug({slug: window.location.hash.slice(1)})
                    window.location.hash = ''
                }
            }
        }
        queryData()
    }, [])
    if(loading === FetchHook.LOADING) return <div>Loading...</div>


    console.log('ChatRoom', businessSlug)
    return (<div className={`${chatSelected ?'hidden md:block w-4/12' : 'w-full'} overflow-y-auto`  }>
        <h2 className="text-2xl px-5 mb-2 border-b border-blue-400 border-opacity-50">Salas de chat</h2>
        <div className="divide-y px-5 divide-blue-400 divide-opacity-50">
            {chatRooms.map((chatRoom) => {
                return <ChatRoomItem key={chatRoom.slug} businessSlug={businessSlug || chatRoom.business.slug}
                                     user={chatRoom.user} business={chatRoom.business} setChatRoomSlug={setChatRoomSlug} setBusinessId={setBusinessId} />
            })}
        </div>
        </div>)
}

export default ChatList
