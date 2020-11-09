import React, { useContext, useEffect, userContext, useState } from "react";
import { Box } from "theme-ui";
import ChatUserContext from "./UserContext";
import { v4 as uuid } from "uuid";
import ChatRoomMessage from "./ChatRoomMessage";
import { iteratee, unionBy } from "lodash";
import ChatRoomOwnMessage from "./ChatRoomOwnMessage";
import ChatRoomMessageOther from "./ChatRoomMessageOther";
import ChatRoomHistoric from './ChatRoomHistoric'

const API = `${window.location.hostname}:${window.location.port}`;

const ChatRoom = ({ slug }) => {
  const { user } = useContext(ChatUserContext);
  const [chatSocket, setChatSocket] = useState();
  const [messageText, setMessageText] = useState("");
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


  const sendMessage = (e) => {
    e.preventDefault();
    const messageVerifier = uuid();
    const newMessage = {
      type: "chat_message",
      message: messageText,
      user: user.pk,
      sender_name: user.name,
      chat_room: chatRoom.id,
      send_verifier: messageVerifier,
    };
    chatSocket.send(JSON.stringify(newMessage));
    setMessageText('')
    setChatSession(chatSessionValues => [...chatSessionValues, newMessage])

  };
  const updateMessages = (newMessages) => {
    console.log('newMessage', newMessages)
    if(newMessages.type === 'seen_messages' ){
      setChatHistory(prevState => {
      return unionBy(Array.isArray(newMessages) ? newMessages : [newMessages], prevState, iteratee('send_verifier'))
    })
    }else{
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


  const createDeal = () => {

  }

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
      if(chatSocket) chatSocket.close()
      getChatRoom();
      getMessages();
    }
    return () => {
      console.log('Change in user, or slug')
      chatSocket?.close();
    };
  }, [user, slug]);

 console.log(chatSocket)

  return (
    <Box as="div" id="chat-room" >
      <Box as="div" className="chat-messages flex flex-col bg-gray-200 px-2 chat-services overflow-auto">
        <ChatRoomHistoric websocket={chatSocket} markAsSeen={bulkMarkAsSeen}>
          {chatHistory.map(message => {
            return <ChatRoomMessage message={message} />
          })}
        </ChatRoomHistoric>
        {chatSession.map(message => {
          if (message.user === user.pk) {
            return <ChatRoomOwnMessage message={message} />
          } else {
            return <ChatRoomMessageOther message={message} markAsSeen={markAsSeen} />
          }
        })}
        {!user.pk ? (<a href={`/accounts/login/?next=${window.location.pathname}`}><div className="bg-red-500 text-white self-start  w-2/3 h-auto p-2  my-2 rounded-md shadow mx-2">
          Necesitas un usuario para poder mandar un mensaje has click aqui para iniciar sesion
        </div></a>) : null}
      </Box>
      <Box as="hr"></Box>
      <form onSubmit={sendMessage}
        className="bg-white flex">
        <input
          className="pl-4 pr-16 py-2  focus:outline-none w-8/12"
          placeholder="Message..."
          value={messageText}
          onChange={handleChange}
        ></input>
        <button type="button" onClick={createDeal} className="w-1/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">Deal</button>
        <button type="submit" className="w-1/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">Send</button>
      </form>

    </Box>
  );
};

export default ChatRoom;
