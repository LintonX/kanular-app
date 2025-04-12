package com.kanular.server.controller;

import com.kanular.server.models.CompleteKanbanBoard;
import com.kanular.server.models.UserAccountDto;
import com.kanular.server.models.UserLoginCredential;
import com.kanular.server.models.UserSignUpCredential;
import com.kanular.server.service.AuthService;
import com.kanular.server.service.JwtService;
import com.kanular.server.service.KanbanBoardService;
import com.kanular.server.utils.Constants;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;
import java.util.UUID;

@RestController
@Slf4j
@AllArgsConstructor
public class AuthController {

    private final String MODE;
    private final AuthService authService;
    private final JwtService jwtService;
    private final KanbanBoardService kanbanBoardService;

    @PostMapping("/api/v1/auth/signup")
    public ResponseEntity<Void> signUp(@RequestBody UserSignUpCredential userSignUpCredential, HttpServletResponse response) {
        log.info("➡️ Entered: AuthController.signup()");
        log.info(userSignUpCredential.toString());

        final UserAccountDto newUserAccountDto =
                authService.signUp(userSignUpCredential);

        if (newUserAccountDto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }


        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<UserAccountDto> login(@RequestBody UserLoginCredential userLoginCredential, HttpServletRequest request, HttpServletResponse response) {
        log.info("➡️ Entered: AuthController.login()");
        log.info(userLoginCredential.toString());

        final Pair<String, UserAccountDto> result = authService.login(userLoginCredential);

        if (result != null) {
            final String jwt = result.getFirst();
            final UserAccountDto userAccountDto = result.getSecond();
            log.info("userAccountDto = {}", userAccountDto);
            final boolean isProduction = MODE.equals("production");

            log.info("isProduction = {}", isProduction);
            log.info("Created jwt = {}", jwt);

            Cookie cookie = new Cookie(Constants.KANULAR_SESSION_KEY, jwt);
            cookie.setHttpOnly(true);
            cookie.setSecure(isProduction);
            cookie.setPath("/");
            cookie.setMaxAge((int) Duration.ofDays(7).getSeconds());
            response.addCookie(cookie);

            log.info("Cookie = {}", cookie.toString());

            return ResponseEntity.status(HttpStatus.OK).body(userAccountDto);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/api/v1/auth/userSession")
    public ResponseEntity<UserAccountDto> getUserSession(HttpServletRequest request) {
        log.info("➡️ Entered: AuthController.getUserFromSession()");

        try {
            String jwt = jwtService.extractJwtFromCookies(request);
            if (jwt == null) {
                log.info("No JWT found in cookies.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);
            if (userAccountDto == null) {
                log.info("JWT verification failed.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            log.info("Session recovered: {}", userAccountDto);
            return ResponseEntity.ok(userAccountDto);

        } catch (Exception e) {
            log.error("Exception in getUserSession: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
