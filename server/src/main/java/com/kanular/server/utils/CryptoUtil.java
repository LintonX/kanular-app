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

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Base64.Decoder;

import static com.kanular.server.utils.Constants.STD_CHARSET;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
@AllArgsConstructor
@Slf4j
public class CryptoUtil {

    private static final int COST = 10;
    private static final int IV_SIZE = 16;
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";

    private final BCrypt.Hasher bCryptHasher;
    private final BCrypt.Verifyer bCryptVerifyer;
    private final SecretKey secretKey;
    private final Encoder encoder;

    public UserAccountDto encrpytUserAccount(@NonNull UserAccountDto userAccountDto) throws InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException, NoSuchAlgorithmException {
        log.info("➡️ Entered: encryptUserAccount()");
        log.info("Attempting to encrypt payload {}", userAccountDto);
        final UserAccountDto encryptedUserAccountDto = UserAccountDto.builder()
                    .id(encryptField(userAccountDto.getId()))
                    .email(encryptField(userAccountDto.getEmail()))
                    .build();
        log.info("Encrypted user account = {}", encryptedUserAccountDto.toString());
        return encryptedUserAccountDto;
    }

    public String encryptField(@NonNull String plainText) throws InvalidAlgorithmParameterException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException, NoSuchAlgorithmException {
        byte[] iv = new byte[IV_SIZE];
        new SecureRandom().nextBytes(iv);
        final Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(iv));
        byte[] encrypted = cipher.doFinal(plainText.getBytes(STD_CHARSET));
        byte[] combined = new byte[iv.length + encrypted.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);
        final String encryptedField = encoder.encodeToString(combined);
        log.info("after encryption: {}", encryptedField);
        return encryptedField;
    }

    public String decryptField(String base64Encrypted) throws IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException, InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException {
        byte[] combined = Base64.getDecoder().decode(base64Encrypted);
        byte[] iv = new byte[IV_SIZE];
        byte[] encrypted = new byte[combined.length - IV_SIZE];
        System.arraycopy(combined, 0, iv, 0, IV_SIZE);
        System.arraycopy(combined, IV_SIZE, encrypted, 0, encrypted.length);
        final Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(iv));
        byte[] decrypted = cipher.doFinal(encrypted);
        final String decryptedField = new String(decrypted, STD_CHARSET);
        log.info("after decryption: {}", decryptedField);
        return decryptedField;
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
