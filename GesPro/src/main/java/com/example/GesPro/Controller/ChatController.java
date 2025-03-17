package com.example.GesPro.Controller;

import com.example.GesPro.Entite.ChatMessage;
import com.example.GesPro.Entite.ChatMessageEntity;
import com.example.GesPro.Entite.Utilisateur;
import com.example.GesPro.Repository.ChatMessageRepository;
import com.example.GesPro.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
@CrossOrigin("*")

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessage message) {
        // Récupérer l'expéditeur et le destinataire
        Utilisateur sender = utilisateurRepository.findById(message.getSenderId()).orElseThrow();
        Utilisateur recipient = utilisateurRepository.findById(message.getRecipientId()).orElseThrow();

        // Sauvegarder le message en base de données
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setContent(message.getContent());
        entity.setSender(sender);
        entity.setRecipient(recipient);
        entity.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(entity);

        // Envoyer le message au destinataire spécifique
        messagingTemplate.convertAndSendToUser(
                recipient.getId().toString(), // Destinataire (ID utilisateur)
                "/queue/messages",           // Destination WebSocket
                message                     // Message
        );
    }
}