import React, {useContext, useState} from 'react'
import {ReactTinyLink} from "react-tiny-link"
import ChatUserContext from './UserContext'
import IconResolver from "./IconResolver"

const linkReplacer = (a) => {
    return `<a href="${a}" target="_blank" rel="nofollow">${a}</a>`
}

const ChatRoomMessage = ({message}) => {


    const [isLoaded, setIsLoaded] = useState(false)

    let isOnlyLink = false

    console.log(message.message)

    if (message.message.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
        isOnlyLink = true
    }

    let richMessage = message.message.replace('<', "&lt")
    richMessage = richMessage.replace('>', "&gt")

    richMessage = richMessage.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, linkReplacer)
    const date = message.send_date ? new Date(message.send_date) : undefined
    const {user} = useContext(ChatUserContext)


        console.log(message.user, user.pk)


    return <div className={`${message.user === user.pk ? "bg-white text-gray-700 self-start"
        : "bg-teal-600 text-white self-end"} w-2/3 h-auto p-2  my-2 rounded-md shadow mr-3`}>
        <div className="flex justify-between">
            <div className="font-semibold">
                {message.sender_name}
            </div>
            {date ? (<div className="text-right" style={{minWidth: '140px'}}>
                {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}
                {message.user === user.pk &&  (<IconResolver icon={message.seen ? "doubleCheck" : "check"}/>)}
            </div>) : (<div style={{width: 24, height: 24}}><IconResolver icon="clock"/></div>)}
        </div>
        <p className="break-words" dangerouslySetInnerHTML={{__html: richMessage}}/>
        {isOnlyLink && (<div className={`transition-all duration-500 ease-in-out overflow-hidden`} style={isLoaded? {maxHeight: '300px'} : {maxHeight: '0'} }><ReactTinyLink
            cardSize="small"
            showGraphic={true}
            maxLine={2}
            minLine={1}
            url={message.message}
            onSuccess={() => setIsLoaded(true)}
            onError={(e) => console.log(e, "XDDDDDDDDDD")}
        /></div>)}
    </div>
}


export default ChatRoomMessage
