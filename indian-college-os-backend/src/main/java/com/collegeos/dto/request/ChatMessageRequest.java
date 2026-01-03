package com.collegeos.dto.request;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private String content;
    private String type; // TEXT, IMAGE, DOCUMENT
    private String fileUrl;
    private String fileName;
}
