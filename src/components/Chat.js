// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar } from 'antd';
import './ChatTemplate.css';
import useAutoLogout from './useAutoLogout';

const Chat = ({ userId }) => {
      useAutoLogout();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientId, setRecipientId] = useState(null);
    const [users, setUsers] = useState([]);
    const messageContainerRef = useRef(null);

    const API_BASE = 'http://192.168.1.80:8081/api/chat';
    const USER_API = 'http://192.168.1.80:8081/api/utilisateurs';

    // 🔹 Charger la liste des utilisateurs
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(USER_API, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUsers(res.data))
        .catch(err => console.error("Erreur chargement utilisateurs", err));
    }, []);

    // 🔹 Charger l'historique quand on change de destinataire
    useEffect(() => {
        if (!recipientId) {
            setMessages([]);
            return;
        }

        const token = localStorage.getItem("token");
        axios.get(`${API_BASE}/history?recipientId=${recipientId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMessages(res.data))
        .catch(err => console.error("Erreur chargement historique", err));
    }, [recipientId]);

    // 🔹 SSE : écouter les nouveaux messages
const eventSourceRef = useRef(null);

useEffect(() => {
    if (!recipientId) {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        return;
    }

    const token = localStorage.getItem("token");
    const eventSourceUrl = `http://192.168.1.80:8081/api/chat/stream?recipientId=${recipientId}&token=${encodeURIComponent(token)}`;

    // Fermer l'ancienne connexion si elle existe
    if (eventSourceRef.current) {
        eventSourceRef.current.close();
    }

    const es = new EventSource(eventSourceUrl);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        setMessages(prev => [...prev, msg]);
    };

    es.onerror = (err) => {
        console.error("SSE error:", err);
        es.close();
        eventSourceRef.current = null;
    };

    return () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    };
}, [recipientId]);

    // 🔹 Scroll automatique
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // 🔹 Envoyer un message
    const sendMessage = async () => {
        if (!newMessage.trim() || !recipientId) return;

        const token = localStorage.getItem("token");
        const message = {
            content: newMessage,
            recipientId: parseInt(recipientId)
        };

        try {
            await axios.post(`${API_BASE}/send`, message, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
        } catch (err) {
            console.error("Erreur envoi message", err);
        }
    };

    // 🔹 Filtrer les messages de la conversation
    const filteredMessages = messages.filter(msg =>
        (msg.senderId === parseInt(userId) && msg.recipientId === parseInt(recipientId)) ||
        (msg.senderId === parseInt(recipientId) && msg.recipientId === parseInt(userId))
    );

    // 🔹 Trier les utilisateurs (moi en haut)
    const sortedUsers = [...users].sort((a, b) =>
        a.id === parseInt(userId) ? -1 : b.id === parseInt(userId) ? 1 : 0
    );

    return (
        <div className="task-list-containerr" style={{ height: "700px", display: 'flex' }}>
            {/* Liste des utilisateurs */}
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h3>Utilisateurs</h3>
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
                                borderRadius: '5px'
                            }}
                        >
                            <Avatar style={{ backgroundColor: '#808080', color: '#fff', marginRight: '10px' }}>
                                {user.nom?.charAt(0).toUpperCase()}
                            </Avatar>
                            <span>
                                {user.id === parseInt(userId) ? `Moi (${user.nom})` : user.nom}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Zone de chat */}
            <div style={{ width: '70%', padding: '10px' }}>
                <h3>Discussion</h3>
                <div
                    ref={messageContainerRef}
                    style={{
                        height: '600px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        padding: '10px',
                        marginBottom: '10px'
                    }}
                >
                    {filteredMessages.length === 0 ? (
                        recipientId ? <p>Aucun message.</p> : <p>Sélectionnez un utilisateur.</p>
                    ) : (
                        filteredMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    textAlign: msg.senderId === parseInt(userId) ? 'right' : 'left',
                                    marginBottom: '10px'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        backgroundColor: msg.senderId === parseInt(userId) ? '#007bff' : '#f0f0f0',
                                        color: msg.senderId === parseInt(userId) ? '#fff' : '#000'
                                    }}
                                >
                                    {msg.content}
                                    <div style={{ fontSize: '0.7em', color: '#888', marginTop: '4px' }}>
                                        {new Date(msg.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ width: '85%', padding: '10px' }}
                />
                <button onClick={sendMessage} style={{ width: '12%', padding: '10px' }}>
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Chat;