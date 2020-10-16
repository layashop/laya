import React from 'react'


const ChatRoomItem = ({
    user,
    business,
    businessSlug,
    setChatRoomSlug,
}) => {

    console.log('User',user)
    const handleClick = () => {
        const chatSlug = `${businessSlug }-${user.id }`
        setChatRoomSlug(chatSlug)
    }


    return <div onClick={handleClick}> 
        <div>
            {user?.name|| user?.username || business?.name }
        </div>
    </div>
}


export default ChatRoomItem