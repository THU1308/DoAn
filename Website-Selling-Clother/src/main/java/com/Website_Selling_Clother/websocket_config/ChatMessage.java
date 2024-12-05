package com.Website_Selling_Clother.websocket_config;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private String content;
    private String sender;
    private String receiver;
}
