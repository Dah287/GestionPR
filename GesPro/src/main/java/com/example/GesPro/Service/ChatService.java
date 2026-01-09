package com.example.GesPro.Service;

import com.example.GesPro.Entite.Message;
import com.example.GesPro.Repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private final MessageRepository messageRepository;

    // Map<recipientId, List<emitter>>
    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public ChatService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getConversation(Long userId, Long recipientId) {
        return messageRepository.findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderByTimestampAsc(
                userId, recipientId,
                recipientId, userId
        );
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public void addEmitter(Long recipientId, SseEmitter emitter) {
        emitters.computeIfAbsent(recipientId, k -> new ArrayList<>()).add(emitter);
    }

    public void removeEmitter(Long recipientId, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(recipientId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) {
                emitters.remove(recipientId);
            }
        }
    }

    public void broadcastMessage(Long recipientId, Message message) {
        List<SseEmitter> list = emitters.get(recipientId);
        if (list != null) {
            for (SseEmitter emitter : new ArrayList<>(list)) {
                try {
                    emitter.send(SseEmitter.event().data(message));
                } catch (IOException e) {
                    list.remove(emitter);
                }
            }
        }
    }
}
