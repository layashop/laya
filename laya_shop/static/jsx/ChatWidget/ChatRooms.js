import React, { useContext, useEffect, userContext, useState } from "react";
import { Box } from "theme-ui";
import ChatUserContext from "./UserContext";
import { v4 as uuid } from "uuid";

const API = "localhost:8000";

const ChatRoom = ({ businessSlug }) => {
  const { userPk } = useContext(ChatUserContext);
  const [chatSocket, setChatSocket] = useState();
  const [messageText, setMessageText] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const handleChange = (e) => setMessageText(e.target.value);
  const [chatRoom, setChatRoom] = useState();
  const [lastMessage, setLastMessageUUID] = useState();

  const getChatRoom = async () => {
    const request = await fetch(
      `http://${API}/api/chat-app/chat-room/?slug=${businessSlug}-${userPk}`
    );
    const data = await request.json();
    console.log("Chat Room", data);
    setChatRoom(...data);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const messageVerifier = uuid();
    setLastMessageUUID(messageVerifier);
  };
  const addMessage = (newMessage) => {
      console.log('lastMessage', lastMessage)
      console.log('new message', newMessage)
    if (newMessage.sendVerifier === lastMessage) {
      console.log("Enviado");
    }
    setChatLog([...chatLog, newMessage]);
  };
  const checkConnection = () => {
    if (!chatSocket || chatSocket.readyState == WebSocket.CLOSED)
      createWSConnection();
  };

  const createWSConnection = () => {
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
    if (userPk) {
      createWSConnection();
      getChatRoom();
    }
    return () => {
      chatSocket?.close();
    };
  }, [userPk]);
  useEffect(() => {
    if (chatRoom && chatSocket) {
        console.log('Last Message', lastMessage)
      const newMessage = {
        type: "chat_message",
        message: messageText,
        userId: userPk,
        chatRoomId: chatRoom.id,
        sendVerifier: lastMessage,
      };
      chatSocket.send(JSON.stringify(newMessage));
    }
  }, [lastMessage]);
  return (
    <Box as="div">
      <Box as="div">Old Messages</Box>
      <Box as="hr"></Box>
      <form onSubmit={sendMessage}>
        <input
          placeholder="Message..."
          value={messageText}
          onChange={handleChange}
        ></input>
      </form>
    </Box>
  );
};

export default ChatRoom;
