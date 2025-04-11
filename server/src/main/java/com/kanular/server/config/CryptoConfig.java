package com.kanular.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;

@Configuration
public class CryptoConfig {

    @Value("${KANULAR_JWT_PAYLOAD_ENCRYPTION_KEY}")
    private String jwtEncryptionKey;

    @Bean
    public Cipher cipher() throws NoSuchPaddingException, NoSuchAlgorithmException {
        return Cipher.getInstance("AES/CBC/PKCS5Padding");
    }

    @Bean
    public SecretKey secretKey() {
        return new SecretKeySpec(jwtEncryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
    }
}
