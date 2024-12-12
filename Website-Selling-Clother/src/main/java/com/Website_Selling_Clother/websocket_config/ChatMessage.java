package com.Website_Selling_Clother.websocket_config;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMessage {
    private String content;
    private String sender;
    private String receiver;
    private String timeStamp;
}
