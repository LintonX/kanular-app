package com.kanular.server.controller;

import com.kanular.server.dal.repositories.KanbanCardRepository;
import com.kanular.server.models.*;
import com.kanular.server.models.entities.KanbanBoard;
import com.kanular.server.models.entities.KanbanCard;
import com.kanular.server.service.JwtService;
import com.kanular.server.service.KanbanBoardService;
import com.kanular.server.utils.CryptoUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@AllArgsConstructor
public class KanbanBoardController {

    private final KanbanCardRepository kanbanCardRepository;
    private KanbanBoardService kanbanBoardService;
    private JwtService jwtService;

    @PostMapping("/api/v1/getDefaultBoard")
    public ResponseEntity<CompleteKanbanBoard> getDefaultBoard(HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.initHomeKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard defaultKanbanBoard =
                kanbanBoardService.getDefaultBoard(UUID.fromString(userAccountDto.getId()));

        return ResponseEntity.status(HttpStatus.OK).body(defaultKanbanBoard);
    }

    @GetMapping("/api/v1/getAllPrimaryBoards")
    public ResponseEntity<KanbanBoard[]> getAllPrimaryBoards(HttpServletRequest request) {

        log.info("➡️ Entered: KanbanBoardController.getAllPrimaryBoards()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final KanbanBoard[] primaryBoards = kanbanBoardService.getAllPrimaryBoards(
                UUID.fromString(userAccountDto.getId())
        );

        if (primaryBoards.length > 0) {
            return ResponseEntity.status(HttpStatus.OK).body(primaryBoards);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/api/v1/createNewPrimaryKanbanBoard")
    public ResponseEntity<CompleteKanbanBoard> createNewPrimaryKanbanBoard(@RequestBody String boardTitle,
                                                                           HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.createNewPrimaryKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.createKanbanBoard(UUID.fromString(userAccountDto.getId()), boardTitle, true);

        return ResponseEntity.status(HttpStatus.OK).body(completeKanbanBoard);

    }

    @PostMapping("/api/v1/createChildKanbanBoard")
    public ResponseEntity<CompleteKanbanBoard> createChildKanbanBoard(@RequestBody String parentId,
                                                                      @RequestBody String title,
                                                                      HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.createChildKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.createKanbanBoard(UUID.fromString(parentId), title, false);

        return ResponseEntity.status(HttpStatus.OK).body(completeKanbanBoard);

    }

    @GetMapping("/api/v1/getKanbanBoardById")
    public ResponseEntity<CompleteKanbanBoard> getKanbanBoardById(@RequestParam String boardId,
                                                              @RequestParam boolean isPrimary,
                                                              @RequestParam boolean isHome,
                                                              HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.getKanbanBoardById()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.getKanbanBoardById(UUID.fromString(boardId), isPrimary, isHome);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(completeKanbanBoard);
    }

    @GetMapping("/api/v1/getKanbanBoardByParentId")
    public ResponseEntity<CompleteKanbanBoard> getKanbanBoardByParentId(@RequestParam boolean isPrimary,
                                                              @RequestParam boolean isHome,
                                                              HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.getKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.getKanbanBoardByParentId(UUID.fromString(userAccountDto.getId()), isPrimary, isHome);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(completeKanbanBoard);
    }

    @PostMapping("/api/v1/updateCardBody")
    public ResponseEntity<KanbanCard> updateCardBody(@RequestBody UpdateCardBodyDto updateCardBodyDto,
                                                     HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.updateCardBody()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final KanbanCard updatedCard = kanbanBoardService.updateCardBody(
                UUID.fromString(updateCardBodyDto.getCardId()), updateCardBodyDto.getBody()
        );

        if (updatedCard != null) {
            return ResponseEntity.status(HttpStatus.OK).body(updatedCard);
        }

        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
    }

    @PostMapping("/api/v1/createTask")
    public ResponseEntity<KanbanCard> createTask(@RequestBody KanbanCard kanbanCard,
                                                 HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.createTask()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final KanbanCard createdCard = kanbanBoardService.createTask(kanbanCard);

        if (createdCard != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCard);
        }

        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
    }
}
