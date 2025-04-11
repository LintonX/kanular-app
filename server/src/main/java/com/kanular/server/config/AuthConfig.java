package com.kanular.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import at.favre.lib.crypto.bcrypt.BCrypt;
import at.favre.lib.crypto.bcrypt.BCrypt.Hasher;
import at.favre.lib.crypto.bcrypt.BCrypt.Verifyer;

@Configuration
public class AuthConfig {

    @Bean
    public Hasher bCryptHasher() {
        return BCrypt.withDefaults();
    }

    @Bean
    public Verifyer bCryptVerifyer() {
        return BCrypt.verifyer();
    }
}
