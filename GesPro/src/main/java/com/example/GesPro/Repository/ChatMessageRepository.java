package com.example.GesPro.Repository;

import com.example.GesPro.Entite.ChatMessageEntity;
import com.example.GesPro.Entite.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
            Utilisateur sender, Utilisateur recipient, Utilisateur recipient2, Utilisateur sender2);
}
