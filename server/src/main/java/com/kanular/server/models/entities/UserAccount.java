package com.kanular.server.models.entities;

import com.kanular.server.models.UserAccountDto;
import jakarta.persistence.*;
import lombok.*;
import org.apache.catalina.User;

import java.lang.reflect.Field;
import java.util.UUID;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class UserAccount {

    @Id
    @Column(updatable = false, nullable = false)
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    public UserAccountDto convertToUserAccountDto() {
        return UserAccountDto.builder()
                .id(this.getId().toString())
                .email(this.getEmail())
                .build();
    }
}
