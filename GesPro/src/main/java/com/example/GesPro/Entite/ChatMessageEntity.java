package com.example.GesPro.Entite;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content; // Contenu du message

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Utilisateur sender; // Expéditeur du message

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private Utilisateur recipient; // Destinataire du message

    private LocalDateTime timestamp; // Date et heure du message

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Utilisateur getSender() {
        return sender;
    }

    public void setSender(Utilisateur sender) {
        this.sender = sender;
    }

    public Utilisateur getRecipient() {
        return recipient;
    }

    public void setRecipient(Utilisateur recipient) {
        this.recipient = recipient;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}