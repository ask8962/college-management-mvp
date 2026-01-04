package com.collegeos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private boolean success;

    public static MessageResponse success(String message) {
        return MessageResponse.builder()
                .message(message)
                .success(true)
                .build();
    }

    public static MessageResponse error(String message) {
        return MessageResponse.builder()
                .message(message)
                .success(false)
                .build();
    }
}
