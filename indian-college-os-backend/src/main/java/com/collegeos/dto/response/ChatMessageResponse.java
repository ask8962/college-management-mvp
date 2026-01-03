package com.collegeos.dto.response;

import com.collegeos.model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String id;
    private String roomId;
    private String senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private String type;
    private String fileUrl;
    private String fileName;
    private LocalDateTime createdAt;
    private boolean isOwn; // If current user sent this message

    public static ChatMessageResponse fromMessage(ChatMessage msg, String currentUserId) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .roomId(msg.getRoomId())
                .senderId(msg.getSenderId())
                .senderName(msg.getSenderName())
                .senderRole(msg.getSenderRole())
                .content(msg.getContent())
                .type(msg.getType().name())
                .fileUrl(msg.getFileUrl())
                .fileName(msg.getFileName())
                .createdAt(msg.getCreatedAt())
                .isOwn(msg.getSenderId().equals(currentUserId))
                .build();
    }
}
