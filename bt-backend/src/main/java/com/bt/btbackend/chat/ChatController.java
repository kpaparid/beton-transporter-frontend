package com.bt.btbackend.chat;


import com.bt.btbackend.chat.model.ChatMessage;
import com.bt.btbackend.chat.model.ChatNotification;
import com.bt.btbackend.chat.service.ChatMessageService;
import com.bt.btbackend.chat.service.ChatRoomService;
import com.bt.btbackend.model.Tour;
import com.bt.btbackend.model.WorkHourBankByDateDriver;
import com.bt.btbackend.security.roles.IsAdmin;
import com.bt.btbackend.security.roles.IsAdminPlus;
import com.bt.btbackend.security.roles.IsUser;
import com.bt.btbackend.security.roles.IsUserPlus;
import com.bt.btbackend.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping("/messenger")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatMessageService chatMessageService;
    @Autowired
    private ChatRoomService chatRoomService;


    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);
        chatMessage.setChatId(chatId.get());

        ChatMessage saved = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                new ChatNotification(
                        saved.getId(),
                        saved.getSenderId(),
                        saved.getSenderName()));
    }

    @GetMapping("/messages/{senderId}/{recipientId}/count")
    public ResponseEntity<?> countNewMessages(
            @PathVariable String senderId,
            @PathVariable String recipientId) {

//        return ResponseEntity
//                .ok(chatMessageService.countNewMessages(senderId, recipientId));
        try {
            return ResponseHandler.generateResponse("Successfully loaded IDs!",
                    HttpStatus.OK, chatMessageService.countNewMessages(senderId, recipientId));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<?> findChatMessages(@PathVariable String senderId,
                                              @PathVariable String recipientId, Pageable pageable) {
//        List<ChatMessage> list = chatMessageService.findChatMessages(senderId, recipientId);
//        list.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());
//        PagedListHolder<ChatMessage> page = new PagedListHolder<>(list);
//        page.setPageSize(pageable.getPageSize());
//        page.setPage(pageable.getPageNumber());
//        PageImpl<ChatMessage> pageImpl = new PageImpl<>(page.getPageList(), pageable, list.size());
//        return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, pageImpl);

        try {
            List<ChatMessage> list = chatMessageService.findChatMessages(senderId, recipientId);
            list.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());
            PagedListHolder<ChatMessage> page = new PagedListHolder<>(list);
            page.setPageSize(pageable.getPageSize());
            page.setPage(pageable.getPageNumber());
            PageImpl<ChatMessage> pageImpl = new PageImpl<>(page.getPageList(), pageable, list.size());
            return ResponseHandler.generateResponse("Successfully loaded IDs!",
                    HttpStatus.OK, pageImpl);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/unread-messages/{senderId}/{recipientId}")
    public ResponseEntity<?> findUnreadMessages(@PathVariable String senderId,
                                                @PathVariable String recipientId) {
//        return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK,
//                chatMessageService.findUnreadMessages(senderId, recipientId));
        try {
            return ResponseHandler.generateResponse("Successfully loaded IDs!",
                    HttpStatus.OK, chatMessageService.findUnreadMessages(senderId, recipientId));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


    @GetMapping("/last-messages/{recipientId}/{senderIds}")
    public ResponseEntity<?> findLastMessageAndUnreadCount(
            @PathVariable String recipientId,
            @PathVariable List<String> senderIds) {
//        return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK,
//                chatMessageService.findLastMessageAndUnreadCount(recipientId, senderIds));
        try {
            return ResponseHandler.generateResponse("Successfully loaded IDs!",
                    HttpStatus.OK, chatMessageService.findLastMessageAndUnreadCount(recipientId, senderIds));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/unread-count/{recipientId}/{senderIds}")
    public ResponseEntity<?> findUnreadCount(
            @PathVariable String recipientId,
            @PathVariable List<String> senderIds) {
//        return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK,
//                chatMessageService.findUnreadCount(recipientId, senderIds));
        try {
            return ResponseHandler.generateResponse("Successfully loaded IDs!",
                    HttpStatus.OK, chatMessageService.findUnreadCount(recipientId, senderIds));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


    @GetMapping("/messages/{id}")
    public ResponseEntity<?> findMessage(@PathVariable long id) {
//        return ResponseEntity
//                .ok(chatMessageService.findById(id));
        try {
            return ResponseHandler.generateResponse("Successfully loaded IDs!", HttpStatus.OK, chatMessageService.findById(id));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}