package com.collegeos.dto.response;

import com.collegeos.model.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private String id;
    private String name;
    private String description;
    private String createdBy;
    private boolean broadcastMode;
    private int memberCount;
    private LocalDateTime createdAt;
    private boolean canSendMessage; // Based on user role and broadcast mode

    public static ChatRoomResponse fromRoom(ChatRoom room, String userRole) {
        boolean canSend = !room.isBroadcastMode() || "ADMIN".equals(userRole);

        return ChatRoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .description(room.getDescription())
                .createdBy(room.getCreatedBy())
                .broadcastMode(room.isBroadcastMode())
                .memberCount(room.getMembers().size())
                .createdAt(room.getCreatedAt())
                .canSendMessage(canSend)
                .build();
    }
}
