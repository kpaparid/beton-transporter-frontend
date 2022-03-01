package com.bt.btbackend.chat.repository;

import com.bt.btbackend.chat.model.ChatMessage;
import com.bt.btbackend.chat.model.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

//@NoRepositoryBean
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    long countBySenderIdAndRecipientIdAndStatus(
            String senderId, String recipientId, MessageStatus status);

    List<ChatMessage> findByChatId(String chatId);

    List<ChatMessage> findByChatIdAndStatus(String chatId, MessageStatus status);

    Optional<ChatMessage> findById(long id);

    List<ChatMessage> findBySenderIdAndRecipientId(String senderId, String recipientId);


    List<ChatMessage> findTopByChatIdOrderByTimestampDesc(String chatId);

}