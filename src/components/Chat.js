import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { Avatar } from 'antd';
import './ChatTemplate.css';

const Chat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientId, setRecipientId] = useState(null);
    const [users, setUsers] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const messageContainerRef = useRef(null);
    

    useEffect(() => {
        axios.get('http://192.168.1.81:8081/utilisateurs')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Erreur lors de la récupération des utilisateurs', error));
    }, []);

    useEffect(() => {
        const socket = new SockJS('http://192.168.1.81:8081/ws');
        const client = Stomp.over(socket);
        

        client.connect({}, () => {
            console.log('✅ WebSocket STOMP connecté avec succès');
            setStompClient(client);
        }, (error) => {
            console.error('❌ Erreur de connexion STOMP:', error);
        });

        // return () => {
        //     if (client) {
        //         client.disconnect(() => {
        //             console.log('Déconnecté du WebSocket');
        //         });
        //     }
        // };
    }, [userId]);

    // useEffect(() => {
    //     if (stompClient && recipientId) {
    //         const subscription = stompClient.subscribe('/topic/messages', (message) => {
    //             const receivedMessage = JSON.parse(message.body);
    //             if (
    //                 (receivedMessage.sender.id === parseInt(userId) && receivedMessage.recipient.id === parseInt(recipientId)) ||
    //                 (receivedMessage.sender.id === parseInt(recipientId) && receivedMessage.recipient.id === parseInt(userId))
    //             ) {
    //                 setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    //             }
    //         });

    //         return () => subscription.unsubscribe();
    //     }
    // }, [stompClient, recipientId]);
    //Sans de 2 second de refelection 

    // useEffect(() => {
    //     if (recipientId) {
    //         axios.get('http://192.168.1.81:8081/api/chat/allMessages')
    //             .then(response => setMessages(response.data))
    //             .catch(error => console.error('Erreur lors de la récupération des messages', error));
    //     } else {
    //         setMessages([]);
    //     }
    // }, [recipientId]);

    useEffect(() => {
        if (recipientId) {
            const fetchMessages = () => {
                axios.get('http://192.168.1.81:8081/api/chat/allMessages')
                    .then(response => setMessages(response.data))
                    .catch(error => console.error('Erreur lors de la récupération des messages', error));
            };
    
            fetchMessages(); // Charger les messages une première fois
            const interval = setInterval(fetchMessages, 2000); // Rafraîchir toutes les 5 sec
    
            return () => clearInterval(interval); // Nettoyer à la destruction
        } else {
            setMessages([]);
        }
    }, [recipientId]);
    

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (stompClient && newMessage.trim() && recipientId) {
            const chatMessage = {
                content: newMessage,
                senderId: userId,
                recipientId: recipientId,
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));

            setMessages(prevMessages => [...prevMessages, {
                content: newMessage,
                sender: { id: parseInt(userId) },
                recipient: { id: parseInt(recipientId) },
                timestamp: new Date().toISOString(),
            }]);

            setNewMessage('');
        }
    };

    const sortedUsers = [...users].sort((a, b) => (a.id === parseInt(userId) ? -1 : b.id === parseInt(userId) ? 1 : 0));

    const filteredMessages = messages.filter(msg =>
        (msg.sender.id === parseInt(userId) && msg.recipient.id === parseInt(recipientId)) ||
        (msg.sender.id === parseInt(recipientId) && msg.recipient.id === parseInt(userId))
    );

    return (
        <div className="task-list-containerr">
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h3>Utilisateurs</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {sortedUsers.map(user => (
                        <li key={user.id} onClick={() => setRecipientId(user.id)}
                            style={{
                                cursor: 'pointer', padding: '10px',
                                backgroundColor: recipientId === user.id ? '#e0e0e0' : 'transparent',
                                display: 'flex', alignItems: 'center', borderRadius: '5px'
                            }}>
                            <Avatar src={user.profileImage || `/icon${user.id}.png`} alt="Avatar" />
                            <span style={{ flexGrow: 1, marginLeft: '10px' }}>{user.id === parseInt(userId) ? `Moi (${user.nom})` : user.nom}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ width: '70%', padding: '10px' }}>
                <h3>Discussion</h3>
                <div ref={messageContainerRef} style={{ height: '600px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                    {filteredMessages.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.sender.id === userId ? 'right' : 'left', marginBottom: '10px' }}>
                            <div style={{
                                display: 'inline-block', padding: '10px', borderRadius: '10px',
                                backgroundColor: msg.sender.id === userId ? '#007bff' : '#f0f0f0',
                                color: msg.sender.id === userId ? '#fff' : '#000'
                            }}>
                                {msg.content}
                                <div style={{ fontSize: '0.7em', color: '#888' }}>{new Date(msg.timestamp).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                    {filteredMessages.length === 0 && recipientId && <div>Aucun message.</div>}
                </div>
                <input type="text" placeholder="Écrire un message..." value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} style={{ width: '98%', padding: '10px' }} />
                <button onClick={sendMessage} style={{ marginTop: '10px' }}>Envoyer</button>
            </div>
        </div>
    );
};

export default Chat;
