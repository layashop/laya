import React from 'react'


const ChatRoomItem = ({
    user,
    business,
    businessSlug,
    setChatRoomSlug,
}) => {

    console.log('User in ChatRoom Item',user)
    const handleClick = () => {
        const chatSlug = `${businessSlug }-${user.id || user}`
        setChatRoomSlug({
            slug: chatSlug,
            chatTitle : user?.name|| user?.username || business?.name
        })
    }


    return <div className='p-2 hover:bg-gray-200 p-1 pr-3 pb-2 cursor-pointer transition duration-200' onClick={handleClick}>
        <div>
            {user?.name|| user?.username || business?.name }
        </div>
    </div>
}


export default ChatRoomItem
