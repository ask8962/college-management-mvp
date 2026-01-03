package com.collegeos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GigRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Budget is required")
    private Integer budget;

    @NotBlank(message = "Contact info is required")
    private String contactInfo;

    private String deadline; // ISO date string
}
