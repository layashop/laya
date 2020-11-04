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
        setChatRoomSlug({
            slug: chatSlug,
            chatTitle : user?.name|| user?.username || business?.name 
        })
    }


    return <div className='p-2' onClick={handleClick}> 
        <div>
            {user?.name|| user?.username || business?.name }
        </div>
    </div>
}


export default ChatRoomItem