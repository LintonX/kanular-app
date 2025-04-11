package com.kanular.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

@NoArgsConstructor
@Getter
@ToString
public abstract class UserCredential {

    private String email;
    private String password;

    public UserCredential(@NonNull String email, @NonNull String password) {
        this.email = email;
        this.password = password;
    }
}
