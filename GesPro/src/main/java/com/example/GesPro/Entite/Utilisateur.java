package com.example.GesPro.Entite;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
@Data
@Entity
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String nomm;
    private String email;
    private String password;
    private String role;

    // ✅ email réel pour envoi
    private String emailSend;
    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tache> taches;
    @JsonIgnore
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private List<ChatMessageEntity> messagesEnvoyes;
    @JsonIgnore
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    private List<ChatMessageEntity> messagesRecus;

    // Getters and Setters
    // Getters
    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getEmailSend() {
        return emailSend;
    }
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public List<Tache> getTaches() {
        return taches;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public void setEmailSend(String email) {
        this.emailSend = email;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setTaches(List<Tache> taches) {
        this.taches = taches;
    }
    public List<ChatMessageEntity> getMessagesEnvoyes() {
        return messagesEnvoyes;
    }

    public void setMessagesEnvoyes(List<ChatMessageEntity> messagesEnvoyes) {
        this.messagesEnvoyes = messagesEnvoyes;
    }

    public List<ChatMessageEntity> getMessagesRecus() {
        return messagesRecus;
    }

    public void setMessagesRecus(List<ChatMessageEntity> messagesRecus) {
        this.messagesRecus = messagesRecus;
    }
}
