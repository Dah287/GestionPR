package com.example.GesPro.Repository;

import com.example.GesPro.Entite.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderByTimestampAsc(
            Long sender1, Long recipient1,
            Long sender2, Long recipient2
    );
}