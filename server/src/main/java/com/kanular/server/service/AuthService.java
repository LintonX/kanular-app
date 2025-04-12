package com.kanular.server.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kanular.server.dal.repositories.UserRepository;
import com.kanular.server.models.*;
import com.kanular.server.models.entities.UserAccount;
import com.kanular.server.utils.CryptoUtil;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {

    private String MODE;

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CryptoUtil cryptoUtil;
    private final KanbanBoardService kanbanBoardService;

    public UserAccountDto signUp(@NonNull UserCredential userSignUpCredential) {

        log.info("➡️ Entered: AuthService.signUp()");

        // user doesnt exist
        // user exists
        if (!(userSignUpCredential instanceof UserSignUpCredential)) {
            return null;
        }

        // passwords dont match
        if (!userSignUpCredential.getPassword().equals(((UserSignUpCredential) userSignUpCredential).getConfirmPassword())) {
            return null;
        }

        // create instance of new user
        final UserAccount newUserAccount = UserAccount.builder()
                .email(userSignUpCredential.getEmail())
                .password(cryptoUtil.hashPassword(userSignUpCredential.getPassword()))
                .build();

        // store new user instance in database
        final UserAccount storedUserAccount = userRepository.save(newUserAccount);
        final CompleteKanbanBoard homeKanbanBoard =
                kanbanBoardService.initHomeKanbanBoard(storedUserAccount.getId());

        if (homeKanbanBoard == null) {
            userRepository.delete(storedUserAccount);
            return null;
        }

        return storedUserAccount.convertToUserAccountDto();
    }

    public Pair<String, UserAccountDto> login(@NonNull UserCredential userLoginCredential) {

        log.info("➡️ Entered: AuthService.login()");

        if (!(userLoginCredential instanceof UserLoginCredential)) {
            return null;
        }

        final Optional<UserAccount> retrievedUserAccount = userRepository.findByEmail(userLoginCredential.getEmail());

        if (retrievedUserAccount.isEmpty()) {
            return null;
        }

        final UserAccount extractedUserAccount = retrievedUserAccount.get();

        final boolean isPasswordVerified = cryptoUtil.verifyPassword(userLoginCredential, extractedUserAccount);

        log.info("is password verified? {}", isPasswordVerified);

        if (isPasswordVerified) {
            try {
//                final UserAccountDto userAccountDto = cryptoUtil.encrpytUserAccount(extractedUserAccount.convertToUserAccountDto());
                return Pair.of(
                        jwtService.createJwt(extractedUserAccount.convertToUserAccountDto()),
                        cryptoUtil.encrpytUserAccount(extractedUserAccount.convertToUserAccountDto())
                );
            } catch (InvalidKeyException | NoSuchPaddingException | NoSuchAlgorithmException | JsonProcessingException | IllegalBlockSizeException | IllegalAccessException | BadPaddingException | InvalidAlgorithmParameterException e) {
                log.error(e.getMessage(), e);
                throw new RuntimeException(e);
            }
        }
        return null;
    }

}
