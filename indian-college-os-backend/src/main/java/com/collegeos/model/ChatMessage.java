package com.collegeos.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private String id;

    private String roomId;
    private String senderId;
    private String senderName;
    private String senderRole; // ADMIN or STUDENT

    private String content;
    private MessageType type;

    // For file attachments
    private String fileUrl;
    private String fileName;

    private LocalDateTime createdAt;

    public enum MessageType {
        TEXT, IMAGE, DOCUMENT, SYSTEM
    }
}
