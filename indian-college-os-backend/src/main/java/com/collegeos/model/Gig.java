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
@Document(collection = "gigs")
public class Gig {
    @Id
    private String id;

    private String title;
    private String description;
    private String category; // ASSIGNMENT, LAB_RECORD, PROJECT, NOTES, OTHER
    private Integer budget; // in rupees
    private String contactInfo; // WhatsApp number or email
    private String postedBy; // user ID
    private String postedByName; // user name for display
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;

    public enum Status {
        OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public enum Category {
        ASSIGNMENT, LAB_RECORD, PROJECT, NOTES, PRESENTATION, OTHER
    }
}
