package com.kanular.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@NoArgsConstructor
@Getter
public class UserLoginCredential extends UserCredential {

    public UserLoginCredential(@NonNull String email,
                               @NonNull String password) {
        super(email, password);
    }

    @Override
    public String toString() {
        return "UserLoginCredential{" +
                "email='" + this.getEmail() + "', " +
                "password='" + this.getPassword() + "'" +
                '}';
    }

}
