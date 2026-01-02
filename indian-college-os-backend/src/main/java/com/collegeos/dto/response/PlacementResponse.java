package com.collegeos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class PlacementResponse {
    private String id;
    private String companyName;
    private String role;
    private String eligibility;
    private LocalDate deadline;
}
