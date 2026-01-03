package com.collegeos.dto.response;

import com.collegeos.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String studentId;
    private String name;
    private String email;
    private User.Role role;
}
