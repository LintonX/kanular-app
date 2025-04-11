package com.kanular.server.models.entities;

import com.kanular.server.models.UserAccountDto;
import jakarta.persistence.*;
import lombok.*;
import org.apache.catalina.User;

import java.lang.reflect.Field;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    public UserAccountDto convertToUserAccountDto() {
        return UserAccountDto.builder()
                .id(this.getId())
                .email(this.getEmail())
                .build();
    }
}
