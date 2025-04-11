package com.kanular.server.utils;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.kanular.server.models.UserAccountDto;
import com.kanular.server.models.UserCredential;
import com.kanular.server.models.entities.UserAccount;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.util.Base64.Encoder;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
@AllArgsConstructor
@Slf4j
public class CryptoUtil {

    private static final int COST = 10;

    private final BCrypt.Hasher bCryptHasher;
    private final BCrypt.Verifyer bCryptVerifyer;
    private final Cipher cipher;
    private final SecretKey secretKey;
    private final Encoder encoder;

    public UserAccountDto encrpytUserAccount(@NonNull UserAccountDto userAccountDto) throws InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        log.info("➡️ Entered: encryptUserAccount()");
        log.info("Attempting to encrypt payload {}", userAccountDto);
        this.cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        final UserAccountDto encryptedUserAccountDto = UserAccountDto.builder()
                    .id(encryptField(userAccountDto.getId()))
                    .email(encryptField(userAccountDto.getEmail()))
                    .build();
        log.info("Encrypted user account = {}", encryptedUserAccountDto.toString());
        return encryptedUserAccountDto;
    }

    private String encryptField(String field) throws IllegalBlockSizeException, BadPaddingException {
        final byte[] cipherText = this.cipher.doFinal(field.getBytes(StandardCharsets.UTF_8));
        final String base64 = encoder.encodeToString(cipherText);
        log.info("Ciphered {} = {}", field, cipherText);
        log.info("Base64 {} = {}", field, base64);
        return base64;
    }

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
