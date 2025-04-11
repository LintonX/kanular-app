package com.kanular.server.service;

import at.favre.lib.crypto.bcrypt.BCrypt.Hasher;
import at.favre.lib.crypto.bcrypt.BCrypt.Verifyer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.kanular.server.dal.repositories.UserRepository;
import com.kanular.server.models.UserCredential;
import com.kanular.server.models.UserLoginCredential;
import com.kanular.server.models.UserSignUpCredential;
import com.kanular.server.models.entities.UserAccount;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import java.security.InvalidKeyException;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {

    private static final int COST = 10;

    @Value("${spring.profiles.active}")
    private static String MODE;

    private final Hasher bCryptHasher;
    private final Verifyer bCryptVerifyer;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public String hashPassword(@NonNull String password) {
        log.info("➡️ Entered: AuthService.hashPassword()");
        return bCryptHasher.hashToString(COST, password.toCharArray());
    }

    public boolean signUp(@NonNull UserCredential userSignUpCredential) {

        log.info("➡️ Entered: AuthService.signUp()");

        // user doesnt exist
        // user exists
        if (!(userSignUpCredential instanceof UserSignUpCredential)) {
            return false;
        }

        // passwords dont match
        if (!userSignUpCredential.getPassword().equals(((UserSignUpCredential) userSignUpCredential).getConfirmPassword())) {
            return false;
        }

        // create instance of new user
        final UserAccount newUserAccount = UserAccount.builder()
                .email(userSignUpCredential.getEmail())
                .password(hashPassword(userSignUpCredential.getPassword()))
                .build();

        // store new user instance in database
        final UserAccount storedUserAccount = userRepository.save(newUserAccount);

        return true;
    }

    public String login(@NonNull UserCredential userLoginCredential) {

        log.info("➡️ Entered: AuthService.login()");

        if (!(userLoginCredential instanceof UserLoginCredential)) {
            return null;
        }

        final Optional<UserAccount> retrievedUserAccount = userRepository.findByEmail(userLoginCredential.getEmail());

        if (retrievedUserAccount.isEmpty()) {
            return null;
        }

        final boolean verified = bCryptVerifyer.verify(
                userLoginCredential.getPassword().toCharArray(),
                retrievedUserAccount.get().getPassword().toCharArray()
        ).verified;

        log.info("is password verified? {}", verified);

        if (verified) {
            try {
                return jwtService.createJwt(retrievedUserAccount.get().convertToUserAccountDto());
            } catch (InvalidKeyException | JsonProcessingException | IllegalBlockSizeException | IllegalAccessException | BadPaddingException e) {
                log.error(e.getMessage(), e);
                throw new RuntimeException(e);
            }
        }
        return null;
    }

}
