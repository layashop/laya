import React, {useContext, useEffect, userContext, useState} from "react";
import {Box} from "theme-ui";
import ChatUserContext from "./UserContext";
import {v4 as uuid} from "uuid";
import ChatRoomMessage from "./ChatRoomMessage";
import {iteratee, unionBy} from "lodash";
import IconResolver from "./IconResolver";

import './emoji-mart.css';
import {Picker} from 'emoji-mart';

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

const API = `${window.location.hostname}:${window.location.port}`;

const ChatRoom = ({slug, isWidget}) => {
    const {user} = useContext(ChatUserContext);
    const [chatSocket, setChatSocket] = useState();
    const [messageText, setMessageText] = useState("");
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatSession, setChatSession] = useState([])
    const handleChange = (e) => setMessageText(e.target.value);
    const [chatRoom, setChatRoom] = useState();
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

    const sendMessage = (e) => {
        e.preventDefault();

        if (messageText.length === 0 || messageText.match(/^\s*$/)) {
            return;
        }

        const cleanMessage =  messageText.replace(/\s\s+/g, ' ')

        const messageVerifier = uuid();
        const newMessage = {
            type: "chat_message",
            message: cleanMessage,
            user: user.pk,
            sender_name: user.name,
            chat_room: chatRoom.id,
            send_verifier: messageVerifier,
        };
        setMessageText('')
        setChatSession(chatSessionValues => [...chatSessionValues, newMessage])
        chatSocket.send(JSON.stringify(newMessage));

    };
    const addMessage = (newMessage) => {
        setChatSession(prevState => {
            return unionBy([newMessage], prevState, iteratee('send_verifier'))
        });
    }
    const checkConnection = () => {
        if (!chatSocket || chatSocket.readyState === WebSocket.CLOSED)
            createWSConnection();
    };

    const onMessageHandler = (e) => {
        const data = JSON.parse(e.data);
        addMessage(data);
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


    const createDeal = () => {

    }

    useEffect(() => {
        if (user.pk && slug) {
            if (chatHistory.length > 0) {
                setChatHistory([]);
            }
            if (!chatSocket) createWSConnection();
            getChatRoom();
            getMessages();
        }
        return () => {
            chatSocket?.close();
        };
    }, [user, slug]);


    return (
        <Box as="div" id="chat-room">
            <Box as="div" className="chat-messages flex flex-col bg-gray-200 px-2 chat-services overflow-y-auto pb-3"
                 style={{minHeight: isWidget ? '' : '70vh'}}>
                {chatHistory.map(message => {
                    return <ChatRoomMessage key={message.send_verifier} message={message}/>
                })}
                {chatSession.map(message => {
                    return <ChatRoomMessage key={message.send_verifier} message={message}/>
                })}
                {!user.pk ? (<a href={`/accounts/login/?next=${window.location.pathname}`}>
                    <div className="bg-red-500 text-white self-start  w-2/3 h-auto p-2  my-2 rounded-md shadow mx-2">
                        Necesitas un usuario para poder mandar un mensaje has click aqui para iniciar sesion
                    </div>
                </a>) : null}
            </Box>
            <form onSubmit={sendMessage}
                  className="bg-white flex sticky bottom-0 w-100 border-t border-blue-500 border-opacity-50">
                <input
                    className="pl-4 pr-16 py-2 my-2  focus:outline-none w-8/12"
                    placeholder="Message..."
                    value={messageText}
                    onChange={handleChange}
                />
                <button
                    className="w-1/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">{!isWidget && "Enviar"}<IconResolver
                    icon="send"/></button>
                <button onClick={createDeal}
                        className="w-1/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">{!isWidget && "Deal"}<IconResolver
                    icon="deal"/></button>
                <span className="relative">
                      <button onClick={emojiModalHandler}
                              className="text-teal-600 bg-white  hover:text-teal-500 m-1 p-3 w-auto transistion-color duration-100 focus:outline-none">😋</button>
                                {isOpenEmoji && <Picker i18n={emojiTrans} showPreview={false} title="Emojis" native={true}
                                                        onSelect={(emoji) => setMessageText(`${messageText}${emoji.native}`)}
                                                        style={{position: 'absolute', right: 0, top: '-420px', zIndex: 20}}/>}
                </span>
            </form>
        </Box>
    );
};

export default ChatRoom;
