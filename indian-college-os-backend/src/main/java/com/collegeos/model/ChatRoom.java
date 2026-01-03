package com.collegeos.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_rooms")
public class ChatRoom {
    @Id
    private String id;

    private String name;
    private String description;
    private String createdBy; // Admin who created it

    // Broadcast mode: when true, only admins can send messages
    private boolean broadcastMode;

    // Members of the room (empty = everyone can join)
    @Builder.Default
    private Set<String> members = new HashSet<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
