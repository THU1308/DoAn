package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.websocket_config.ChatMessage;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Xử lý user gửi tin nhắn tới admin
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Gửi tin nhắn đến kênh của admin
        messagingTemplate.convertAndSend("/topic/admin/chat", chatMessage);
    }

    /**
     * Xử lý admin gửi phản hồi tới user
     */
    @MessageMapping("/chat.replyMessage")
    public void replyMessage(@Payload ChatMessage chatMessage) {
        String userId = chatMessage.getReceiver();
        String txt = "/user/" + userId + "/queue/private";
        messagingTemplate.convertAndSend("/user/" + userId + "/queue/private", chatMessage);
    }
}
