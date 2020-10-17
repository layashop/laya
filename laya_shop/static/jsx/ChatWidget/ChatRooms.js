import React, { useContext, useEffect, userContext, useState } from "react";
import { Box } from "theme-ui";
import ChatUserContext from "./UserContext";
import { v4 as uuid } from "uuid";
import ChatRoomMessage from "./ChatRoomMessage";

const API = `${window.location.hostname}:${window.location.port}`;

const ChatRoom = ({ slug }) => {
  const { user } = useContext(ChatUserContext);
  const [chatSocket, setChatSocket] = useState();
  const [messageText, setMessageText] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const handleChange = (e) => setMessageText(e.target.value);
  const [chatRoom, setChatRoom] = useState();
  const [lastMessage, setLastMessageUUID] = useState();

  const getChatRoom = async () => {
    const request = await fetch(
      `http://${API}/api/chat-app/chat-room/?slug=${slug}`
    );
    const data = await request.json();
    console.log("Chat Room", data);
    setChatRoom(...data);
  };
  const getLastMessage = () => {
    console.log('Last Message 2',lastMessage)
    return lastMessage
  }
  const sendMessage = (e) => {
    e.preventDefault();
    const messageVerifier = uuid();
    setLastMessageUUID(messageVerifier);
  };
  const addMessage = (newMessage) => {
      console.log('lastMessage', lastMessage)
      console.log('new message', newMessage)
    if (newMessage.sendVerifier === getLastMessage()) {
      console.log("Enviado");
    }
    setChatLog(prevState => [...prevState, newMessage]);
  };
  const checkConnection = () => {
    if (!chatSocket || chatSocket.readyState == WebSocket.CLOSED)
      createWSConnection();
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
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      addMessage(data);
    };
    ws.onerror = (err) => {
      console.error("Socket error:", err.message);
      ws.close();
    };
  };
  useEffect(() => {
    if (user.pk && slug) {
      createWSConnection();
      getChatRoom();
    }
    return () => {
      chatSocket?.close();
    };
  }, [user, slug]);
  useEffect(() => {
    if (chatRoom && chatSocket) {
        console.log('Last Message', lastMessage)
      const newMessage = {
        type: "chat_message",
        message: messageText,
        userId: user.pk,
        senderName : user.name,
        chatRoomId: chatRoom.id,
        sendVerifier: lastMessage,
      };
      setMessageText('')
      chatSocket.send(JSON.stringify(newMessage));

    }
  }, [lastMessage]);
  return (
    <Box as="div" id="chat-room">
      <Box as="div" className="chat-messages flex flex-col bg-gray-200 px-2 chat-services overflow-auto">
        {chatLog.map(message => {
          return <ChatRoomMessage key={message.sendVerifier} message={message}></ChatRoomMessage>
        })}
        {!user.pk ? (<a href={`/accounts/login/?next=${window.location.pathname}`}><div className="bg-red-500 text-white self-start  w-2/3 h-auto p-2  my-2 rounded-md shadow mx-2">
          Necesitas un usuario para poder mandar un mensaje has click aqui para iniciar sesion
        </div></a>) : null}
      </Box>
      <Box as="hr"></Box>
      <form onSubmit={sendMessage}
      className="bg-white flex">
        <input
        className="pl-4 pr-16 py-2  focus:outline-none w-10/12"
          placeholder="Message..."
          value={messageText}
          onChange={handleChange}
        ></input>
        <button className="w-2/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">Send</button>
      </form>
    </Box>
  );
};

export default ChatRoom;
