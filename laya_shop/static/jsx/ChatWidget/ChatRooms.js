import React, { Component } from "react";
import { Box } from "theme-ui";
import ChatUserContext from "./UserContext";
import { v4 as uuid } from "uuid";
import ChatRoomMessage from "./ChatRoomMessage";

const API = `${window.location.hostname}:${window.location.port}`;



class ChatRoom extends Component {
    static contextType = ChatUserContext
    state = {
        webSocket: null,
        messageText: '',
        chatRoom: null,
        chatLog: [],
        lastMessage: '',
        showModal: false
    }

    constructor(props) {
        super(props)

    }

    componentDidMount(){
         this.createWSConnection();
      this.getChatRoom();
      this.getMessages();
    }
    componentDidUpdate(prevProp, prevState) {
                const user = this.context.user

        if (prevProp.slug !== this.props.slug) {
            if (this.state.chatLog.length > 0) {
                this.setChatLog([]);
            }
            this.createWSConnection();
            this.getChatRoom();
            this.getMessages();
        }

        if (prevState.lastMessage !== this.state.lastMessage) {
            const { chatRoom, webSocket } = this.state
            if (chatRoom && webSocket) {
                console.log('Last Message', this.state.lastMessage)
               

            }
        }

    }

    componentWillUnmount() {
        this.state.webSocket.close()
    }
    handleChange = (e) => this.setState({
        messageText: e.target.value
    })

    getChatRoom = async () => {
        const request = await fetch(
            `http://${API}/api/chat-app/chat-room/?slug=${this.props.slug}`
        );
        const data = await request.json();
        console.log("Chat Room", data);
        const [chatRoom] = data
        this.setState({
            chatRoom
        });
    };

    onMessageHandler = (e) => {
        const data = JSON.parse(e.data);
        this.addMessage(data);
    };

    getMessages = async () => {
        const request = await fetch(`http://${API}/api/chat-app/chat-message/?slug=${this.props.slug}`)
        const data = await request.json();
        console.log('Chat messages', data)
        this.setState({
            chatLog: data
        });
    }

    sendMessage = (e) => {
        console.log('CALLING SEND MESSAGE')
        e.preventDefault();
        const messageVerifier = uuid();
        this.setState({
            lastMessage: messageVerifier
        });
                const user = this.context.user

         const newMessage = {
                    type: "chat_message",
                    message: this.state.messageText,
                    user: user.pk,
                    sender_name: user.name,
                    chat_room: this.state.chatRoom.id,
                    send_verifier: messageVerifier,
                };
                console.log('New Message,', newMessage);
                this.setState({
                    messageText: ''
                })
                this.state.webSocket.send(JSON.stringify(newMessage));
    };

    addMessage = (newMessage) => {
        console.log(newMessage)
        console.log(this.state.lastMessage)
        if (newMessage.send_verifier === this.state.lastMessage) {
            console.log("Enviado");
        }
        this.setState(prevState => {
            return {
                chatLog: [...prevState.chatLog, newMessage]
            }
        });
    };

    checkConnection = () => {
        if (!this.state.webSocket || this.state.webSocket.readyState == WebSocket.CLOSED)
            this.createWSConnection();
    };

    createWSConnection = () => {
        const [businessSlug, userPk] = this.props.slug.split('-')
        const ws = new WebSocket(`ws://${API}/ws/chat/${businessSlug}/${userPk}/`);
        ws.onopen = () => {
            console.log("Connected to WebSocket");
            this.setState({
                webSocket: ws
            });
        };
        ws.onclose = (e) => {
            console.log("Connection Closed, attempting to reconnect", e.reason);
            setTimeout(this.checkConnection);
        };

        ws.onmessage = this.onMessageHandler
        ws.onerror = (err) => {
            console.error("Socket error:", err.message);
            ws.close();
        };
    };


    render() {
        const { chatLog, messageText } = this.state
        const user = this.context.user

        return (
            <Box as="div" id="chat-room" >
                <Box as="div" className="chat-messages flex flex-col bg-gray-200 px-2 chat-services overflow-auto">
                    {chatLog.map(message => {
                        return <ChatRoomMessage key={message.send_verifier} message={message}></ChatRoomMessage>
                    })}
                    {!user.pk ? (<a href={`/accounts/login/?next=${window.location.pathname}`}><div className="bg-red-500 text-white self-start  w-2/3 h-auto p-2  my-2 rounded-md shadow mx-2">
                        Necesitas un usuario para poder mandar un mensaje has click aqui para iniciar sesion
        </div></a>) : null}
                </Box>
                <Box as="hr"></Box>
                <form onSubmit={this.sendMessage}
                    className="bg-white flex">
                    <input
                        className="pl-4 pr-16 py-2  focus:outline-none w-8/12"
                        placeholder="Message..."
                        value={messageText}
                        onChange={this.handleChange}
                    ></input>
                    {/* <button onClick={openModal} className="w-1/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">Deal</button> */}
                    <button className="w-1/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">Send</button>
                </form>
                {/* <Modal show={show} 
      onCancel={onCancel}
      title='Deal'
      >
        <div>
          Leonel se la Come
        </div>
      </Modal> */}
            </Box>
        )

    }


}


export default ChatRoom;
