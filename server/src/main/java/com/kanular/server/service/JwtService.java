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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64.Encoder;
import java.util.Base64.Decoder;

import static com.kanular.server.utils.Constants.KANULAR_SESSION_KEY;


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
            IllegalAccessException,
            InvalidAlgorithmParameterException,
            NoSuchPaddingException,
            NoSuchAlgorithmException {

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

    public String extractJwtFromCookies(@NonNull HttpServletRequest request) {
        final Cookie[] cookies = request.getCookies();

        try {
            String jwt = null;
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (KANULAR_SESSION_KEY.equals(cookie.getName())) {
                        jwt = cookie.getValue();
                        log.info("Kanular session value = {}", jwt);
                        return jwt;
                    }
                }
            }

        } catch (Exception e) {
            log.info(e.toString());
            throw new RuntimeException(e);
        }

        return null;
    }


}
