package com.Website_Selling_Clother.websocket_config;

public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;

    // Getters và setters

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
