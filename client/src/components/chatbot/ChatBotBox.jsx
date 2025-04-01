import { Stack } from "react-bootstrap";
import InputEmoji from  'react-input-emoji';
import { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const ChatBotBox = () => {
    
    const user = localStorage.getItem("User");
    const {socket} = useContext(ChatContext);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const scroll = useRef();

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
      // Listen for incoming messages from the server
      if(socket === null) return;
      
      socket.on("chatbot-message", async (msg) => {
        await setMessages((prevMessages) => [...prevMessages, `Bot: ${msg}`]);
   
    });
        
      // Cleanup on component unmount
      return () => {
        socket.off('chatbot-message');
      };
    }, [messages]);
  
    const handleSendMessage = () => {
      if (messageInput.trim()) {
        setMessages((prevMessages) => [...prevMessages, `You: ${messageInput}`]);
        socket.emit('chatbot-message', messageInput);
        setMessageInput('');
      }
    };
    
    return ( 
        <Stack gap={3} className="chat-box">
            <div className = "chatbot-box">
                <div className="chat-header">
                    <strong>Mew bot</strong>
                </div>
        <Stack gap={3} className="messages-chatbot">
            {messages.map((msg, index) => (
            <Stack key={index} ref={scroll}>{msg}</Stack>
            ))}
            
        </Stack>
        <Stack direction="horizontal" gap ={3} className="chat-input flex-grow-0">
                <InputEmoji value={messageInput} onChange={setMessageInput} fontFamily="nunito" borderColor="rgba(72,112,223,0.2)"/>
                <button className="send-btn" onClick={handleSendMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                </svg>
                </button>
        </Stack>
        </div>
            </Stack>
     );
}
 
export default ChatBotBox;