package com.kanular.server.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Base64.Decoder;

@Configuration
public class UtilsConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public Encoder base64Encoder() {
        return Base64.getEncoder();
    }

    @Bean
    public Decoder base64Decoder() {
        return Base64.getDecoder();
    }

}
