package com.collegeos.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true, sparse = true)
    private String studentId;

    private String password;

    private Role role;

    // 2FA fields
    private boolean twoFactorEnabled;
    private String twoFactorSecret;

    public enum Role {
        ADMIN, STUDENT
    }
}
