package com.collegeos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class NoticeResponse {
    private String id;
    private String title;
    private String fileUrl;
    private String summary;
    private LocalDateTime createdAt;
}
