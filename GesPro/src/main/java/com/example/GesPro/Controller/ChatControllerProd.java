package com.example.GesPro.Controller;



import com.example.GesPro.Entite.Message;
import com.example.GesPro.Security.JwtUtil;
import com.example.GesPro.Service.ChatService;
import com.example.GesPro.Service.UtilisateurService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chat")
public class ChatControllerProd {


    private final ChatService chatService;
    private final JwtUtil jwtUtil;
    private final UtilisateurService utilisateurService;

    public ChatControllerProd(ChatService chatService, JwtUtil jwtUtil, UtilisateurService utilisateurService) {
        this.chatService = chatService;
        this.jwtUtil = jwtUtil;
        this.utilisateurService = utilisateurService;
    }

    private Long getCurrentUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        String email = jwtUtil.extractEmail(token); // ← récupère l'email du token

        return utilisateurService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email))
                .getId();
    }

    @PostMapping("/send")
    public Message sendMessage(@RequestHeader("Authorization") String authHeader,
                               @RequestBody Message message) {
        Long senderId = getCurrentUserId(authHeader);
        message.setSenderId(senderId);
        Message saved = chatService.saveMessage(message);

        // Envoyer au destinataire ET à l'expéditeur
        chatService.broadcastMessage(message.getRecipientId(), saved);
        chatService.broadcastMessage(senderId, saved);

        return saved;
    }

    @GetMapping("/history")
    public List<Message> getHistory(@RequestHeader("Authorization") String authHeader,
                                    @RequestParam Long recipientId) {
        Long userId = getCurrentUserId(authHeader);
        return chatService.getConversation(userId, recipientId);
    }

    // Pour SSE : on reçoit le token en paramètre d'URL
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamMessages(@RequestParam String token,
                                     @RequestParam Long recipientId) {
        String email = jwtUtil.extractEmail(token);
        Long userId = utilisateurService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"))
                .getId();

        SseEmitter emitter = new SseEmitter(60_000L);

        // ✅ Enregistrer l'émetteur UNIQUEMENT pour l'utilisateur connecté (userId)
        chatService.addEmitter(userId, emitter);

        // Nettoyage
        emitter.onCompletion(() -> chatService.removeEmitter(userId, emitter));
        emitter.onTimeout(() -> {
            emitter.complete();
            chatService.removeEmitter(userId, emitter);
        });

        return emitter;
    }
}