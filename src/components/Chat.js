import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { Avatar } from "antd";
import "./ChatTemplate.css";
const Chat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientId, setRecipientId] = useState(null); // ID du destinataire
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [stompClient, setStompClient] = useState(null);
    const messageContainerRef = useRef(null);
    const [notifications, setNotifications] = useState({});
    // Récupérer la liste des utilisateurs
    useEffect(() => {
        axios.get('http://localhost:8081/utilisateurs')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Erreur lors de la récupération des utilisateurs', error));
    }, []);

    // Connexion WebSocket
    useEffect(() => {
        const socket = new SockJS('http://localhost:8081/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log('Connecté au WebSocket');
            setStompClient(client);


        }, (error) => {
            console.error('Erreur de connexion WebSocket:', error);
        });

        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log('Déconnecté du WebSocket');
                });
            }
        };
    }, [userId]);


    const sendMessage = () => {
        if (stompClient && newMessage.trim() && recipientId) {
            const chatMessage2 = {
                content: newMessage,
                sender: { id: parseInt(userId) }, // Assurez-vous que sender est un objet avec un id
                recipient: { id: parseInt(recipientId) }, // Assurez-vous que recipient est un objet avec un id
                timestamp: new Date().toISOString(), // Ajouter un timestamp
            };
                        const chatMessage = {
                content: newMessage,
                senderId: userId,
                recipientId: recipientId,
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessages((prevMessages) => [...prevMessages, chatMessage2]); // Mise à jour immédiate
            setNewMessage('');
        }
    };

    // Récupérer l'historique des messages
    useEffect(() => {
        if (recipientId) {
            axios.get(`http://localhost:8081/api/chat/allMessages`)
                .then(response => setMessages(response.data))
                .catch(error => console.error('Erreur lors de la récupération des messages', error));
        } else {
            setMessages([]);
        }
        console.log("data recipientId:--> ", recipientId);
        console.log("data userId:--> ", userId);
    }, [recipientId, userId]);

    

    // Scroll automatique vers le bas
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const filteredMessages = messages.filter(
        (msg) =>
            (msg.sender.id === parseInt(userId) && msg.recipient.id === parseInt(recipientId)) ||
            (msg.sender.id === parseInt(recipientId) && msg.recipient.id === parseInt(userId))
    );
    console.log("data recipientId: ", recipientId);
    console.log("data userId: ", userId);
    console.log("data filtre: ", filteredMessages);
    const sortedUsers = [...users].sort((a, b) => {
        if (a.id === parseInt(userId)) {
            return -1; // a vient en premier
        }
        if (b.id === parseInt(userId)) {
            return 1; // b vient en premier
        }
        return 0; // Aucun changement d'ordre
    });
    
    return (
        <div className="task-list-containerr">
            {/* Colonne gauche : Liste des utilisateurs */}
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
            <h3 >Utilisateurs</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
    {sortedUsers.map(user => (
        <li
            key={user.id}
            onClick={() => setRecipientId(user.id)}
            style={{
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: recipientId === user.id ? '#e0e0e0' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '5px',
                transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = recipientId === user.id ? '#e0e0e0' : 'transparent')}
        >
            {/* Avatar */}
            <div style={{ marginRight: '10px' }}>
                <Avatar
                    src={user.profileImage || `/icon${user.id}.png`}
                    alt="Avatar"
                    onClick={() => console.log(user)}
                />
            </div>

            {/* Nom de l'utilisateur */}
            <span style={{ flexGrow: 1 }}>
                {user.id === parseInt(userId) ? `Moi (${user.nom})` : user.nom}
            </span>

            {/* Icône de message non lu */}
            {user.unreadCount > 0 && (
                <i
                    className="fas fa-comment-dots"
                    style={{ color: 'orange', fontSize: '20px' }}
                ></i>
            )}
        </li>
    ))}
</ul>
        </div>

            {/* Colonne droite : Zone de discussion */}
            <div style={{ width: '70%', padding: '10px' }}>
                <h3>Discussion</h3>
                <div ref={messageContainerRef} style={{ height: '600px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                    {filteredMessages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                textAlign: msg.sender.id === userId ? 'right' : 'left',
                                marginBottom: '10px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-block',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: msg.sender.id === userId ? '#007bff' : '#f0f0f0',
                                    color: msg.sender.id === userId ? '#fff' : '#000',
                                }}
                            >
                                {msg.content}
                                <div style={{ fontSize: '0.7em', color: '#888' }}>
                                    {new Date(msg.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredMessages.length === 0 && recipientId && <div>Aucun message.</div>}
                </div>
                <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ width: '98%', padding: '10px', marginRight: '10px' }}
                />
                <button onClick={sendMessage} style={{ padding: '10px' }}>Envoyer</button>
            </div>
        </div>
    );
};

export default Chat;