import React, { useState } from "react";
import './ChatTemplate.css';

const ChatTemplate = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "User", text: message }]);
      setMessage("");
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "User" ? "user-message" : "bot-message"}`}>
            <span>{msg.sender}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          className="chat-input"
          placeholder="Tapez un message..."
        />
        <button onClick={handleSendMessage} className="send-button">Envoyer</button>
      </div>
    </div>
  );
};

export default ChatTemplate;
