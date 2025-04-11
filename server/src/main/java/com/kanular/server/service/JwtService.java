package com.kanular.server.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kanular.server.models.UserAccountDto;
import com.kanular.server.utils.CryptoUtil;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64.Encoder;
import java.util.Base64.Decoder;


@Service
@AllArgsConstructor
@Slf4j
public class JwtService {

    private final static int DAYS_TO_ADD = 7;

    private final Algorithm algorithm;
    private final CryptoUtil cryptoUtil;
    private final ObjectMapper objectMapper;
    private final Decoder decoder;
    private final JWTVerifier jwtVerifier;
    private final String issuer;

    public String createJwt(@NonNull UserAccountDto userAccountDto) throws InvalidKeyException,
                                                                           JsonProcessingException,
                                                                           IllegalBlockSizeException,
                                                                           BadPaddingException,
                                                                           IllegalAccessException {

        final UserAccountDto encryptedUserAccountDto = cryptoUtil.encrpytUserAccount(userAccountDto);
        final String encryptedPayload = objectMapper.writeValueAsString(encryptedUserAccountDto);
        return JWT.create()
                .withPayload(encryptedPayload)
                .withExpiresAt(Instant.now().plus(DAYS_TO_ADD, ChronoUnit.DAYS))
                .withIssuer(issuer)
                .sign(algorithm);
    }

    public UserAccountDto verifyJwt(@NonNull String jwt) {
        try {
            final DecodedJWT verifiedJwt = jwtVerifier.verify(jwt);
            final String payload = verifiedJwt.getPayload();
            final byte[] decodedPayload = decoder.decode(payload);
            final UserAccountDto userAccountDto = objectMapper.readValue(decodedPayload, UserAccountDto.class);
            log.info("Verified and extracted User from jwt: {}", userAccountDto.toString());
            return userAccountDto;
        } catch (JWTVerificationException | IOException e) {
            log.error(e.toString());
            return null;
        }
    }


}
