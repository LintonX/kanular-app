package com.kanular.server.controller;

import com.kanular.server.models.UserAccountDto;
import com.kanular.server.models.UserLoginCredential;
import com.kanular.server.models.UserSignUpCredential;
import com.kanular.server.service.AuthService;
import com.kanular.server.service.JwtService;
import com.kanular.server.utils.Constants;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;

@RestController
@Slf4j
@AllArgsConstructor
public class AuthController {

    private final String MODE;
    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/api/v1/auth/signup")
    public ResponseEntity<Void> signUp(@RequestBody UserSignUpCredential userSignUpCredential, HttpServletResponse response) {
        log.info("➡️ Entered: AuthController.signup()");
        log.info(userSignUpCredential.toString());

        final boolean result = authService.signUp(userSignUpCredential);

        if (result) {
            return new ResponseEntity<>(HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<Void> login(@RequestBody UserLoginCredential userLoginCredential, HttpServletRequest request, HttpServletResponse response) {
        log.info("➡️ Entered: AuthController.login()");
        log.info(userLoginCredential.toString());

        final String jwt = authService.login(userLoginCredential);

        if (jwt != null) {
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
            return new ResponseEntity<>(HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/api/v1/auth/userSession")
    public ResponseEntity<UserAccountDto> getUserSession(HttpServletRequest request) {
        log.info("➡️ Entered: AuthController.getUserFromSession()");

        final Cookie[] cookies = request.getCookies();

        try {

            String jwt = null;
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (Constants.KANULAR_SESSION_KEY.equals(cookie.getName())) {
                        jwt = cookie.getValue();
                        log.info("Kanular session value = {}", jwt);
                        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);
                        if (userAccountDto != null) {
                            log.info("Recovered session {}", userAccountDto);
                            return new ResponseEntity<>(userAccountDto, HttpStatus.OK);
                        }
                        break;
                    }
                }
            }

        } catch (Exception e) {
            log.info(e.toString());
            throw new RuntimeException(e);
        }
        log.info("Session invalid");

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
