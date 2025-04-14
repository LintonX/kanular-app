package com.kanular.server.utils;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.kanular.server.models.UserCredential;
import com.kanular.server.models.entities.UserAccount;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
@AllArgsConstructor
@Slf4j
public class CryptoUtil {

    private static final int COST = 10;
    private final BCrypt.Hasher bCryptHasher;
    private final BCrypt.Verifyer bCryptVerifyer;

    public String hashPassword(@NonNull String password) {
        log.info("➡️ Entered: AuthService.hashPassword()");
        return bCryptHasher.hashToString(COST, password.toCharArray());
    }

    public boolean verifyPassword(@NonNull UserCredential userLoginCredential,
                                  @NonNull UserAccount retrievedUserAccount) {
        return bCryptVerifyer.verify(
                userLoginCredential.getPassword().toCharArray(),
                retrievedUserAccount.getPassword().toCharArray()
        ).verified;
    }
}