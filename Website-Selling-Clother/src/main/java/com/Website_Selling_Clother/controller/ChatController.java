package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.websocket_config.ChatMessage;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@AllArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private RedisTemplate<String, ChatMessage> redisTemplate;


    /**
     * Xử lý user gửi tin nhắn tới admin
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Gửi tin nhắn đến kênh của admin
        List<ChatMessage> messages = redisTemplate.opsForList().range("chat_session:" + chatMessage.getSender(), 0, -1);
        chatMessage.setTimeStamp(LocalDateTime.now().toString());
        redisTemplate.opsForList().rightPush("chat_session:" + chatMessage.getSender(), chatMessage);
        messagingTemplate.convertAndSend("/topic/admin/chat", chatMessage);
    }

    /**
     * Xử lý admin gửi phản hồi tới user
     */
    @MessageMapping("/chat.replyMessage")
    public void replyMessage(@Payload ChatMessage chatMessage) {
        List<ChatMessage> messages = redisTemplate.opsForList().range("chat_session:" + chatMessage.getSender(), 0, -1);
        String userId = chatMessage.getReceiver();
        chatMessage.setTimeStamp(LocalDateTime.now().toString());
        redisTemplate.opsForList().rightPush("chat_session:" + chatMessage.getReceiver(), chatMessage);
        messagingTemplate.convertAndSend("/user/" + userId + "/queue/private", chatMessage);
    }

    @GetMapping("/chat/history/{userId}")
    public List<ChatMessage> getChatHistory(@PathVariable String userId) {
        return redisTemplate.opsForList().range("chat_session:" + userId, 0, -1);
    }
}
