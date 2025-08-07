package com.example.GesPro.Controller;

import com.example.GesPro.Entite.ChatMessageEntity;
import com.example.GesPro.Entite.Utilisateur;
import com.example.GesPro.Repository.ChatMessageRepository;
import com.example.GesPro.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/chat")
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @GetMapping("/messages")
    public List<ChatMessageEntity> getMessages(
            @RequestParam Long senderId,
            @RequestParam Long recipientId) {

        Utilisateur sender = utilisateurRepository.findById(senderId).orElse(null);
        Utilisateur recipient = utilisateurRepository.findById(recipientId).orElse(null);

        return chatMessageRepository.findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(sender, recipient, recipient, sender);
    }

    // Nouvelle API pour récupérer tous les messages
    @GetMapping("/allMessages")
    public List<ChatMessageEntity> getAllMessages() {
        return chatMessageRepository.findAll();
    }
}