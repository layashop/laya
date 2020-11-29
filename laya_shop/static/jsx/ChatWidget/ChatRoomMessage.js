import React, {useContext, useState, useEffect} from 'react'
import {ReactTinyLink} from "react-tiny-link"
import ChatUserContext from './UserContext'
import IconResolver from "./IconResolver"
import PostPreview from "./PostPreview"
import _ from 'lodash'

const linkReplacer = (a) => {
    return `<a href="${a}" target="_blank" rel="nofollow">${a}</a>`
}

const ChatRoomMessage = ({message, slug = undefined}) => {

    const {user} = useContext(ChatUserContext)

    const ownMessage = message.user === user.pk

    let date = undefined

    if (message.send_date) {
        date = new Date(message.send_date)
        date.setHours(date.getHours() + 6)
    }


    if (!message.message) {
        return <></>
    }

    const [isLoaded, setIsLoaded] = useState(false)
    const [preview, setPreview] = useState([])

    let isOnlyLink = false

    if (message.message.match(/^\|\|laya\?\w+?\?{.+?}\|\|$/)) {
        const [, type, obj] = message.message.replace(/\|/g, '').split('?')
        const parsedObj = JSON.parse(obj)

        if (type === 'deal') {
            return (<div className={`${ownMessage ? "bg-white text-gray-700 self-start"
                : "bg-teal-600 text-white self-end"} w-2/3 h-auto p-2  my-2 rounded-md shadow mr-3`}>
                <div className="flex justify-between">
                    <div className="font-semibold">
                        {message.sender_name}
                    </div>
                    {date ? (<div className="text-right" style={{minWidth: '140px'}}>
                        {`${date.getDate()}/${_.padStart(date.getMonth() + 1, 2, '0')}/${date.getFullYear()} ${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}`}
                        {message.user === user.pk && (<IconResolver icon={message.seen ? "doubleCheck" : "check"}/>)}
                    </div>) : (<div style={{width: 24, height: 24}}><IconResolver icon="clock"/></div>)}
                </div>
                <a className={'p-4'}
                   href={slug ? `/${slug}/dashboard/deals#${parsedObj.id}` : `/profile/${USER.username}/deals/#${parsedObj.id}`}><IconResolver
                    icon="dealSent"/>{message.sender_name} envió una petición de acuerdo
                    (#{_.padStart(parsedObj.id, 7, '0')})</a>
            </div>)
        }

        if (type === 'product') {
            const ids = parsedObj.id.reduce((accumulator, currentVal) => `${accumulator}&id=${currentVal}`, '')
            useEffect(() => {
                fetch(`${window.location.origin}/api/posts/preview?${ids}`)
                    .then(res => res.json())
                    .then(data => {
                        setPreview(data)
                        setIsLoaded(true)
                    })
            }, [])

            return (<div className={`${ownMessage ? "bg-white text-gray-700 self-start"
                : "bg-teal-600 text-white self-end"} w-2/3 h-auto p-2  my-2 rounded-md shadow mr-3`}>
                <div className="flex justify-between">
                    <div className="font-semibold">
                        {message.sender_name}
                    </div>
                    {date ? (<div className="text-right" style={{minWidth: '140px'}}>
                        {`${date.getDate()}/${_.padStart(date.getMonth() + 1, 2, '0')}/${date.getFullYear()} ${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}`}
                        {message.user === user.pk && (<IconResolver icon={message.seen ? "doubleCheck" : "check"}/>)}
                    </div>) : (<div style={{width: 24, height: 24}}><IconResolver icon="clock"/></div>)}
                </div>
                {isLoaded ? <PostPreview data={preview} ownMessage={ownMessage}/> :
                    <div className={`loader-${ownMessage ? 'dark' : 'light'}`}>Loading...</div>}
            </div>)

        }

    }


    if (message.message.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
        isOnlyLink = true
    }

    let richMessage = message.message.replace('&', "&amp;")
    richMessage = richMessage.replace('>', "&gt;")
    richMessage = richMessage.replace('<', "&lt;")

    richMessage = richMessage.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, linkReplacer)


    // console.log(`Message: `, message)
    // console.log(`Seen:${message.seen}
    // Send Date: ${message.send_date} , Date: ${date} `)
    return <div className={`${ownMessage ? "bg-white text-gray-700 self-start"
        : "bg-teal-600 text-white self-end"} w-2/3 h-auto p-2  my-2 rounded-md shadow mr-3`}>
        <div className="flex justify-between">
            <div className="font-semibold">
                {message.sender_name}
            </div>
            {date ? (<div className="text-right" style={{minWidth: '140px'}}>
                {`${date.getDate()}/${_.padStart(date.getMonth() + 1, 2, '0')}/${date.getFullYear()} ${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}`}
                {message.user === user.pk && (<IconResolver icon={message.seen ? "doubleCheck" : "check"}/>)}
            </div>) : (<div style={{width: 24, height: 24}}><IconResolver icon="clock"/></div>)}
        </div>
        <p className="break-words" dangerouslySetInnerHTML={{__html: richMessage}}/>
        {isOnlyLink && (<div className={`transition-all duration-500 ease-in-out overflow-hidden`}
                             style={isLoaded ? {maxHeight: '300px'} : {maxHeight: '0'}}><ReactTinyLink
            cardSize="small"
            showGraphic={true}
            maxLine={2}
            minLine={1}
            url={message.message}
            onSuccess={() => setIsLoaded(true)}
        /></div>)}
    </div>
}


export default ChatRoomMessage
