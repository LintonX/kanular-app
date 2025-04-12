package com.kanular.server.controller;

import com.kanular.server.models.CompleteKanbanBoard;
import com.kanular.server.models.UserAccountDto;
import com.kanular.server.models.entities.KanbanBoard;
import com.kanular.server.service.JwtService;
import com.kanular.server.service.KanbanBoardService;
import com.kanular.server.utils.CryptoUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@RestController
@Slf4j
@AllArgsConstructor
public class KanbanBoardController {

    private KanbanBoardService kanbanBoardService;
    private JwtService jwtService;
    private CryptoUtil cryptoUtil;

    @PostMapping("/api/v1/initHomeKanbanBoard")
    public ResponseEntity<CompleteKanbanBoard> initHomeKanbanBoard(HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.initHomeKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.initHomeKanbanBoard(UUID.fromString(userAccountDto.getId()));

        return ResponseEntity.status(HttpStatus.OK).body(completeKanbanBoard);
    }

    @PostMapping("/api/v1/createNewPrimaryKanbanBoard")
    public ResponseEntity<CompleteKanbanBoard> createNewPrimaryKanbanBoard(HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.createNewPrimaryKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.createKanbanBoard(UUID.fromString(userAccountDto.getId()), true);

        return ResponseEntity.status(HttpStatus.OK).body(completeKanbanBoard);

    }

    @PostMapping("/api/v1/createChildKanbanBoard")
    public ResponseEntity<CompleteKanbanBoard> createChildKanbanBoard(@RequestBody String parentId,
                                                                      HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.createChildKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.createKanbanBoard(UUID.fromString(parentId), false);

        return ResponseEntity.status(HttpStatus.OK).body(completeKanbanBoard);

    }

    @GetMapping("/api/v1/hydrateDashboard")
    public ResponseEntity<Pair<CompleteKanbanBoard, KanbanBoard[]>> hydrateDashboard(HttpServletRequest request) {

        // want the full home board and
        // want primary board shallow details
        log.info("➡️ Entered: KanbanBoardController.hydrateDashboard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Pair<CompleteKanbanBoard, KanbanBoard[]> hydratedDashboard =
                null;
        try {
            hydratedDashboard = kanbanBoardService.hydrateDashboard(
                    UUID.fromString(cryptoUtil.decryptField(userAccountDto.getId()))
            );
        } catch (IllegalBlockSizeException | BadPaddingException | InvalidKeyException |
                 InvalidAlgorithmParameterException | NoSuchPaddingException | NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.status(HttpStatus.OK).body(hydratedDashboard);
    }

    @GetMapping("/api/v1/getKanbanBoard")
    public ResponseEntity<CompleteKanbanBoard> getKanbanBoard(@RequestParam String boardId,
                                                              @RequestParam boolean isPrimary,
                                                              @RequestParam boolean isHome,
                                                              HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.getKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.getKanbanBoard(UUID.fromString(boardId), isPrimary, isHome);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(completeKanbanBoard);
    }

}
