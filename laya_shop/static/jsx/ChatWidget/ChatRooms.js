import React, {useContext, useEffect, useRef, useState} from "react";
import {Box} from "theme-ui";
import ChatUserContext from "./UserContext";
import {v4 as uuid} from "uuid";
import ChatRoomMessage from "./ChatRoomMessage";
import {iteratee, unionBy, orderBy} from "lodash";
import ChatRoomOwnMessage from "./ChatRoomOwnMessage";
import ChatRoomMessageOther from "./ChatRoomMessageOther";
import ChatRoomHistoric from './ChatRoomHistoric'
import PostSelector from "../PostSelector/PostSelector";

import IconResolver from "./IconResolver";

import './emoji-mart.css';
import {Picker} from 'emoji-mart';

const API = `${window.location.hostname}:${window.location.port}`;

const PRODUCT_INFO = document.getElementById('post_info')

const emojiTrans = {
    search: 'Buscar',
    clear: 'Limpiar', // Accessible label on "clear" button
    notfound: 'No se encontraron emojis',
    skintext: 'Escoja su tono de piel',
    categories: {
        search: 'Resultados',
        recent: 'Usados frecuentemente',
        smileys: 'Caritas & Emociones',
        people: 'Personas & Cuerpo',
        nature: 'Animales & Naturaleza',
        foods: 'Comidas & Bebidas',
        activity: 'Actividades',
        places: 'Viaje & Lugares',
        objects: 'Objetos',
        symbols: 'Símbolos',
        flags: 'Banderas',
        custom: 'Custom',
    },
    categorieslabel: 'Emoji categories', // Accessible title for the list of categories
    skintones: {
        1: 'Tono por defecto',
        2: 'Tono claro',
        3: 'Tono medio claro',
        4: 'Tono medio',
        5: 'Tono medio oscuro',
        6: 'Tono oscuro',
    },
}

const ChatRoom = ({slug, isWidget}) => {
    const {user} = useContext(ChatUserContext);
    const [chatSocket, setChatSocket] = useState();
    const [messageText, setMessageText] = useState("");
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [isOpenDeal, setIsOpenDeal] = useState(false);
    const [isOpenSubmenu, setIsOpenSubmenu] = useState(false);
    const [isOpenPostSelector, setIsOpenPostSelector] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatSession, setChatSession] = useState([]);
    const handleChange = (e) => setMessageText(e.target.value);
    const [chatRoom, setChatRoom] = useState();
    const overlayRef = useRef();
    // const [lastMessage, setLastMessageUUID] = useState();

    const getChatRoom = async () => {
        const request = await fetch(
            `http://${API}/api/chat-app/chat-room/?slug=${slug}`
        );
        const data = await request.json();
        console.log("Chat Room", data);
        setChatRoom(...data);
    };
    const getMessages = async () => {
        const request = await fetch(`http://${API}/api/chat-app/chat-message/?slug=${slug}`)
        const data = await request.json();
        console.log('Chat messages', data)
        setChatHistory(data);
    }

    const emojiModalHandler = (e) => {
        e.preventDefault()
        setIsOpenEmoji(!isOpenEmoji)
    }

    const dealModalHandler = (e) => {
        e.preventDefault()
        setIsOpenSubmenu(!isOpenSubmenu)
    }


    const sendMessage = (e, message) => {
        e.preventDefault();


        if ((messageText.length === 0 || messageText.match(/^\s*$/)) && !message) {
            return;
        }

        const cleanMessage = message || messageText.replace(/\s\s+/g, ' ')

        const messageVerifier = uuid();
        const newMessage = {
            type: "chat_message",
            message: cleanMessage,
            user: user.pk,
            sender_name: user.name,
            chat_room: chatRoom.id,
            send_verifier: messageVerifier,
        };

        chatSocket.send(JSON.stringify(newMessage));
        if (!message) {
            setMessageText('')
        }
        setChatSession(chatSessionValues => [...chatSessionValues, newMessage])

    };

    const sendCurrent = (e) => {
        sendMessage(e, `||laya?product?{"id":[${PRODUCT_INFO.dataset.postId}]}||`)
        setIsOpenSubmenu(false)
    }

    const sendList = (e) => {
        e.preventDefault()
        setIsOpenSubmenu(false)
        setIsOpenPostSelector(true)
    }


    const updateMessages = (newMessages) => {
        console.log('newMessage', newMessages)
        if (newMessages.type === 'seen_messages') {

            setChatHistory(prevState => {
                const historicMessages = newMessages.messages.reduce((acc, current) => {
                    console.log('Current ', current.send_verifier)
                    const isInHistoric = prevState.findIndex(message => message.send_verifier === current.send_verifier)
                    if (isInHistoric !== -1) {

                        acc.push(current)
                    }
                    return acc
                }, [])
                console.log('Historic Message', historicMessages)

                return unionBy(historicMessages, prevState, iteratee('send_verifier'))
            })

            setChatSession(prevState => {
                const sessionMessages = newMessages.messages.reduce((acc, current) => {
                    console.log('Current ', current.send_verifier)
                    const isInSession = prevState.findIndex(message => message.send_verifier === current.send_verifier)
                    if (isInSession !== -1) {

                        acc.push(current)
                    }
                    return acc
                }, [])
                console.log('Session Message', sessionMessages)
                return unionBy(sessionMessages, prevState, iteratee('send_verifier'))
            });
        } else {
            console.log('New Messages Received', newMessages);
            setChatSession(prevState => {
                return unionBy(Array.isArray(newMessages) ? newMessages : [newMessages], prevState, iteratee('send_verifier'))
            });
        }
    }
    const checkConnection = () => {
        if (!chatSocket || chatSocket.readyState == WebSocket.CLOSED)
            createWSConnection();
    };

    const onMessageHandler = (e) => {
        const data = JSON.parse(e.data);
        updateMessages(data);
    };

    const createWSConnection = () => {
        const [businessSlug, userPk] = slug.split('-')
        const ws = new WebSocket(`ws://${API}/ws/chat/${businessSlug}/${userPk}/`);
        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setChatSocket(ws);
        };
        ws.onclose = (e) => {
            console.log("Connection Closed, attempting to reconnect", e.reason);
            setTimeout(checkConnection);
        };

        ws.onmessage = onMessageHandler
        ws.onerror = (err) => {
            console.error("Socket error:", err.message);
            ws.close();
        };
    };


    const markAsSeen = (messageId) => {
        if (chatSocket) {
            chatSocket.send(JSON.stringify({
                type: "seen_messages_current",
                user_id: user.pk,
                message_id: messageId
            }))
        }
    }

    const bulkMarkAsSeen = (userId) => {
        if (chatSocket) {
            chatSocket.send(JSON.stringify({
                type: "seen_messages",
                user_id: userId,
                slug: slug
            }))
        }
    }

    useEffect(() => {
        if (user.pk && slug) {
            if (chatHistory.length > 0) {
                setChatHistory([]);
                setChatSession([])
            }
            if (!chatSocket) createWSConnection();
            if (chatSocket) chatSocket.close()
            getChatRoom();
            getMessages();
        }
        return () => {
            console.log('Change in user, or slug')
            chatSocket?.close();
        };
    }, [user, slug]);


    const orderedChatHistory = orderBy(chatHistory, ['id'], ['asc'])
    const orderedChatSession = orderBy(chatSession, ['id'], ['asc'])

    return (
        <Box as="div" id="chat-room">
            <Box as="div" className="chat-messages flex flex-col bg-gray-200 px-2 chat-services overflow-y-auto pb-3"
                 style={{minHeight: isWidget ? '' : '70vh'}}>
                <ChatRoomHistoric websocket={chatSocket} markAsSeen={bulkMarkAsSeen}>
                    {orderedChatHistory.map(message => {
                        return <ChatRoomMessage message={message}/>
                    })}
                </ChatRoomHistoric>
                {orderedChatSession.map(message => {
                    if (message.user === user.pk) {
                        return <ChatRoomOwnMessage message={message}/>
                    } else {
                        return <ChatRoomMessageOther message={message} markAsSeen={markAsSeen}/>
                    }
                })}
                {!user.pk ? (<a href={`/accounts/login/?next=${window.location.pathname}`}>
                    <div className="bg-red-500 text-white self-start  w-2/3 h-auto p-2  my-2 rounded-md shadow mx-2">
                        Necesitas un usuario para poder mandar un mensaje has click aqui para iniciar sesion
                    </div>
                </a>) : null}
            </Box>
            <Box as="form" onSubmit={sendMessage}
                 className="bg-white flex bottom-0 w-100 border-t border-blue-500 border-opacity-50"
                 sx={{position: isWidget ? '' : 'sticky'}}
            >
                <input
                    className="pl-4 pr-16 py-2 my-2  focus:outline-none w-8/12"
                    placeholder="Message..."
                    value={messageText}
                    onChange={handleChange}
                />
                <span className="relative">
                    <button
                        className="h-full text-teal-600 bg-white hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">{!isWidget && "Enviar"}<IconResolver
                        icon="send"/></button>
                </span>
                <span className="relative">
                    <button onClick={dealModalHandler}
                            className="h-full text-teal-600 bg-white hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">{!isWidget && "Adjuntar"}<IconResolver
                        icon="more"/></button>
                    {isOpenSubmenu && <Box as="div" sx={{
                        right: '-20px',
                        top: isWidget ? '-180px' : '-147px',
                        zIndex: 20,
                        bg: 'white',
                        width: '280px',
                        position: 'absolute',
                        p: 10
                    }}>
                        <h4 className="text-xl">Seleccione una opción</h4>
                        <hr className="pb-2"/>
                        {isWidget && (<button className="hover:bg-gray-200 w-full text-left transistion duration-100"
                                              onClick={sendCurrent}><IconResolver icon="upright"/> Enviar este producto
                        </button>)}
                        <button className="hover:bg-gray-200 w-full text-left transistion duration-100"
                                onClick={sendList}><IconResolver icon="search"/>Enviar otro producto
                        </button>
                        <button className="hover:bg-gray-200 w-full text-left transistion duration-100"><IconResolver
                            icon="deal"/>Enviar acuerdo
                        </button>
                    </Box>}
                </span>
                <span className="relative">
                      <button onClick={emojiModalHandler}
                              className="text-teal-600 bg-white h-full hover:text-teal-500 m-1 p-3 w-auto transistion-color duration-100 focus:outline-none">😋</button>
                    {isOpenEmoji && <Picker i18n={emojiTrans} showPreview={false} title="Emojis" native={true}
                                            onSelect={(emoji) => setMessageText(`${messageText}${emoji.native}`)}
                                            style={{position: 'absolute', right: 0, top: '-420px', zIndex: 20}}/>}
                </span>
            </Box>
            {isOpenPostSelector && (<Box
                __css={{
                    display: 'flex',
                    position: 'fixed',
                    zIndex: 100,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    bg: 'rgba(0,0,0,0.5)',
                    alignItems: "center",
                    justifyContent: 'center'
                }}
                ref={overlayRef}
                onClick={e => {
                    e.preventDefault()
                    if (e.target === overlayRef.current) {
                        setIsOpenPostSelector(false)

                    }
                }}>
                <Box __css={{width: '50%', bg: 'white', borderRadius: '10px'}}>
                    <PostSelector businessId={PRODUCT_INFO.dataset.businessId}/>
                </Box>
            </Box>)}
        </Box>
    );
}

export default ChatRoom;
