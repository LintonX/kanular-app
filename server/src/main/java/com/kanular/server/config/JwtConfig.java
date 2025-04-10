package com.kanular.server.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class JwtConfig {

    @Value("${KANULAR_JWT_SIGNING_KEY}")
    private String jwtSigningKey;

    @Bean(name = "issuer")
    public String getIssuer() {
        return "kanular";
    }

    @Bean
    public Algorithm algorithm() {
        return Algorithm.HMAC256(jwtSigningKey);
    }

    @Bean
    public JWTVerifier jwtVerifier(@NonNull Algorithm algorithm, @NonNull String issuer) {
        return JWT.require(algorithm).withIssuer(issuer).build();
    }

}
