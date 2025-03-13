import React, { useState, useEffect } from 'react';
import Chat from './Chat'; // Importez votre composant Chat

const ChatTemplate = () => {
    const projectId = 1; // Remplacez par l'ID du projet dynamique si nécessaire
    const [userId, setUserId] = useState(null); // Initialisez userId à null

    useEffect(() => {
        // Récupérer l'ID de l'utilisateur depuis localStorage
        const storedUserId = localStorage.getItem("id_utilisateur");
        if (storedUserId) {
            setUserId(parseInt(storedUserId)); // Convertir en nombre si nécessaire
        }
    }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois au montage du composant

    return (
        <div className="chat-template">
            <h2>Chat en temps réel</h2>
            <div className="chat-container">
                {userId && <Chat userId={userId} />} {/* Rendre Chat uniquement si userId est disponible */}
            </div>
        </div>
    );
};

export default ChatTemplate;