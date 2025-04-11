package com.kanular.server.models;

import lombok.*;

@NoArgsConstructor
@Getter
public class UserSignUpCredential extends UserCredential{

    public String confirmPassword;

    public UserSignUpCredential(@NonNull String email,
                                @NonNull String password,
                                @NonNull String confirmPassword) {
        super(email, password);
        this.confirmPassword = confirmPassword;
    }

    @Override
    public String toString() {
        return "UserSignUpCredential{" +
                "email='" + this.getEmail() + "', " +
                "password='" + this.getPassword() + "', " +
                "confirmPassword='" + confirmPassword + '\'' +
                '}';
    }
}
