import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import './ChatTemplate.css';
const ChatTemplatee = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [username, setUsername] = useState(""); // Nom d'utilisateur
  const [toUser, setToUser] = useState(""); // Utilisateur avec qui on veut chatter

  useEffect(() => {
    const client = new Client({
      brokerURL: "http://localhost:8080/chat", // URL WebSocket du backend
      connectHeaders: {
        // Si nécessaire, vous pouvez envoyer des informations d'en-tête ici
      },
      onConnect: () => {
        console.log("Connected to WebSocket!");
        client.send(`/app/chat/enter?username=${username}`, {}, ""); // S'abonner lorsque l'utilisateur se connecte
        client.subscribe(`/user/queue/messages`, (messageOutput) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            messageOutput.body,
          ]);
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket.");
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });
    client.activate();
    setStompClient(client);
    return () => {
      client.deactivate();
    };
  }, [username]);

  const handleSendMessage = () => {
    if (message.trim()) {
      stompClient.send(
        `/app/chat/sendMessage?fromUser=${username}&toUser=${toUser}&message=${message}`,
        {},
        message
      ); // Envoie un message à l'utilisateur spécifique
      setMessage(""); // Réinitialiser le champ de message
    }
  };

  return (
    <div className="task-list-container">
      <div >
        <label>Nom d'utilisateur : </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
        />
      </div>
      <div>
        <label>Utilisateur à contacter : </label>
        <input
          type="text"
          value={toUser}
          onChange={(e) => setToUser(e.target.value)}
          placeholder="Nom de l'utilisateur"
        />
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>
            <span>{msg}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tapez un message"
      />
      <button onClick={handleSendMessage}>Envoyer</button>
    </div>
  );
};

export default ChatTemplatee;
