package com.collegeos.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRoomRequest {
    @NotBlank(message = "Room name is required")
    private String name;

    private String description;
    private boolean broadcastMode;
}
