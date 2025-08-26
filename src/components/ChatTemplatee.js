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
  const token = localStorage.getItem("token"); // Récupérer le token stocké au login

  const client = new Client({
    brokerURL: "ws://localhost:8080/chat", // ⚠️ mets bien `ws://` et pas `http://`
    connectHeaders: {
      Authorization: `Bearer ${token}`, // <-- envoi du JWT
    },
    onConnect: () => {
      console.log("✅ Connected to WebSocket!");

      // Entrée de l'utilisateur dans le chat
      client.send(`/app/chat/enter?username=${username}`, {}, "");

      // Abonnement aux messages privés (file d’attente de l’utilisateur connecté)
      client.subscribe(`/user/queue/messages`, (messageOutput) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          JSON.parse(messageOutput.body), // ⚠️ parse JSON si backend envoie un objet
        ]);
      });
    },
    onDisconnect: () => {
      console.log("❌ Disconnected from WebSocket.");
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },
  });

  client.activate();
  setStompClient(client);

  return () => {
    client.deactivate();
  };
}, [username]);

const handleSendMessage = () => {
  if (message.trim() && stompClient) {
    const token = localStorage.getItem("token");

    stompClient.publish({
      destination: `/app/chat/sendMessage?fromUser=${username}&toUser=${toUser}`,
      headers: { Authorization: `Bearer ${token}` }, // <-- ajoute aussi le token au message
      body: JSON.stringify({
        fromUser: username,
        toUser,
        message,
      }),
    });

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
