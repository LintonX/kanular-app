package com.kanular.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${MODE}")
    private String MODE;

    @Bean(name = "MODE")
    public String mode() {
        return MODE;
    }
}
