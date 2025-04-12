package com.kanular.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class CryptoConfig {

    private static final int IV_SIZE = 16;
    @Value("${KANULAR_JWT_PAYLOAD_ENCRYPTION_KEY}")
    private String jwtEncryptionKey;

    @Bean
    public SecretKey secretKey() {
        return new SecretKeySpec(jwtEncryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
    }

}
