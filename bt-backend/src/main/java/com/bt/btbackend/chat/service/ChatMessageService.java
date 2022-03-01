package com.bt.btbackend.chat.service;


import com.bt.btbackend.chat.model.ChatMessage;
import com.bt.btbackend.chat.model.MessageStatus;
import com.bt.btbackend.chat.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Stream;

@Service
public class ChatMessageService {
    @Autowired
    private ChatMessageRepository repository;
    @Autowired
    private ChatRoomService chatRoomService;
//    @Autowired private MongoOperations mongoOperations;

    public ChatMessage save(ChatMessage chatMessage) {
        chatMessage.setStatus(MessageStatus.RECEIVED);
        repository.save(chatMessage);
        return chatMessage;
    }

    public long countNewMessages(String senderId, String recipientId) {
        return repository.countBySenderIdAndRecipientIdAndStatus(
                senderId, recipientId, MessageStatus.RECEIVED);
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatId(senderId, recipientId, false);
        var messages =
                chatId.map(cId -> repository.findByChatId(cId)).orElse(new ArrayList<>());
        if (messages.size() > 0) {
            updateStatuses(senderId, recipientId, MessageStatus.DELIVERED);
//            updateStatuses(recipientId, senderId, MessageStatus.DELIVERED);
        }
        return messages;
    }

    public ChatMessage findById(long id) {
        return repository
                .findById(id)
                .map(chatMessage -> {
                    chatMessage.setStatus(MessageStatus.DELIVERED);
                    return repository.save(chatMessage);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException("can't find message (" + id + ")"));
    }

    public void updateStatuses(String senderId, String recipientId, MessageStatus status) {
        List<ChatMessage> list = repository.findBySenderIdAndRecipientId(senderId, recipientId);
        for (ChatMessage m : list) {
            m.setStatus(status);
            repository.save(m);
        }
    }

    public int findUnreadCount(String recipientId, List<String> senderIds) {
        int unreadCount = 0;
        for (String senderId : senderIds) {
            Map<String, Object> nestedObject = new HashMap<>();
            var chatId = chatRoomService.getChatId(senderId, recipientId, false);
            var messages =
                    chatId.map(cId -> repository.findTopByChatIdOrderByTimestampDesc(cId)).orElse(new ArrayList<>());
            messages.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());
            var count = repository.countBySenderIdAndRecipientIdAndStatus(senderId, recipientId, MessageStatus.RECEIVED);
            unreadCount += count;
        }
        return unreadCount;
    }
    public Object findLastMessageAndUnreadCount(String recipientId, List<String> senderIds) {
        Map<String, Object> object = new HashMap<>();
        for (String senderId : senderIds) {
            Map<String, Object> nestedObject = new HashMap<>();
            var chatId = chatRoomService.getChatId(senderId, recipientId, false);
            var messages =
                    chatId.map(cId -> repository.findTopByChatIdOrderByTimestampDesc(cId)).orElse(new ArrayList<>());
            messages.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());
            var count = repository.countBySenderIdAndRecipientIdAndStatus(senderId, recipientId, MessageStatus.RECEIVED);
            if (messages.size() > 0) {
                nestedObject.put("message", messages.get(0));
            } else {
                nestedObject.put("message", null);
            }
            nestedObject.put("unreadCount", count);
            object.put(senderId, nestedObject);
        }
        return object;
    }

    public List<ChatMessage> findUnreadMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatId(senderId, recipientId, false);
        var messages =
                chatId.map(cId -> repository.findByChatIdAndStatus(cId, MessageStatus.RECEIVED)).orElse(new ArrayList<>());
//        if (messages.size() > 0) {
//            updateStatuses(recipientId, senderId, MessageStatus.DELIVERED);
//        }
        return messages;
    }
}
