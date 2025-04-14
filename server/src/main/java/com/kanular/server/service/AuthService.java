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
        final CompleteKanbanBoard defaultKanbanBoard =
                kanbanBoardService.getDefaultBoard(storedUserAccount.getId());

        if (defaultKanbanBoard == null) {
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
              final UserAccountDto userAccountDto = extractedUserAccount.convertToUserAccountDto();
                return Pair.of(
                        jwtService.createJwt(userAccountDto),
                        userAccountDto
                );
            } catch (JsonProcessingException e) {
                log.error(e.getMessage(), e);
                throw new RuntimeException(e);
            }
        }
        return null;
    }

}
