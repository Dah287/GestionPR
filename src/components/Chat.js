import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';

const Chat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientId, setRecipientId] = useState(null); // ID du destinataire
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [stompClient, setStompClient] = useState(null);
    const messageContainerRef = useRef(null);

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

            // S'abonner aux messages privés
            client.subscribe(`/user/${userId}/queue/messages`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            });
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

    // Envoyer un message
    // const sendMessage = () => {
    //     if (stompClient && newMessage.trim() && recipientId) {
    //         const chatMessage = {
    //             content: newMessage,
    //             senderId: userId,
    //             recipientId: recipientId,
    //         };
    //         stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    //       //  setMessages((prevMessages) => [...prevMessages, chatMessage]); // Mise à jour immédiate
    //         setNewMessage('');
    //     }
    // };

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
            axios.get(`http://localhost:8081/api/chat/messages?senderId=${userId}&recipientId=${recipientId}`)
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
    return (
        <div style={{ display: 'flex' }}>
            {/* Colonne gauche : Liste des utilisateurs */}
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h3>Utilisateurs</h3>
                <ul>
                    {users.map(user => (
                        <li
                            key={user.id}
                            onClick={() => setRecipientId(user.id)}
                            style={{ cursor: 'pointer', padding: '5px', backgroundColor: recipientId === user.id ? '#f0f0f0' : '#fff' }}
                        >
                            {user.nom}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Colonne droite : Zone de discussion */}
            <div style={{ width: '70%', padding: '10px' }}>
                <h3>Discussion</h3>
                <div ref={messageContainerRef} style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
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
                    style={{ width: '80%', padding: '10px', marginRight: '10px' }}
                />
                <button onClick={sendMessage} style={{ padding: '10px' }}>Envoyer</button>
            </div>
        </div>
    );
};

export default Chat;