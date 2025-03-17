package com.example.GesPro.Entite;

public class ChatMessage {
    private String content;
    private Long senderId;    // ID de l'expéditeur
    private Long recipientId; // ID du destinataire

    // Getters et setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }
}
