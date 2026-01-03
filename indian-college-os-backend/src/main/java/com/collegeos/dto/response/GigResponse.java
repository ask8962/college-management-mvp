package com.collegeos.dto.response;

import com.collegeos.model.Gig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GigResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private Integer budget;
    private String contactInfo;
    private String postedBy;
    private String postedByName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    private boolean isOwner; // Flag to show edit/delete buttons

    public static GigResponse fromGig(Gig gig, String currentUserId) {
        return GigResponse.builder()
                .id(gig.getId())
                .title(gig.getTitle())
                .description(gig.getDescription())
                .category(gig.getCategory())
                .budget(gig.getBudget())
                .contactInfo(gig.getContactInfo())
                .postedBy(gig.getPostedBy())
                .postedByName(gig.getPostedByName())
                .status(gig.getStatus().name())
                .createdAt(gig.getCreatedAt())
                .deadline(gig.getDeadline())
                .isOwner(gig.getPostedBy().equals(currentUserId))
                .build();
    }
}
