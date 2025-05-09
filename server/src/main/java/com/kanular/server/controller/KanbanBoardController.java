package com.kanular.server.controller;

import com.kanular.server.dal.repositories.KanbanCardRepository;
import com.kanular.server.models.*;
import com.kanular.server.models.entities.KanbanBoard;
import com.kanular.server.models.entities.KanbanCard;
import com.kanular.server.service.JwtService;
import com.kanular.server.service.KanbanBoardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @PostMapping(value = "/api/v1/createNewPrimaryKanbanBoard", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<CompleteKanbanBoard> createNewPrimaryKanbanBoard(@RequestBody String boardTitle,
                                                                           HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.createNewPrimaryKanbanBoard() with {}", boardTitle);

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard newCompletePrimaryBoard =
                kanbanBoardService.createKanbanBoard(UUID.fromString(userAccountDto.getId()), boardTitle, true, false);

        return ResponseEntity.status(HttpStatus.OK).body(newCompletePrimaryBoard);

    }

    @PostMapping("/api/v1/createChildKanbanBoard")
    public ResponseEntity<CompleteKanbanBoard> createChildKanbanBoard(@RequestBody CreateChildKanbanBoardDto createChildKanbanBoardDto,
                                                                      HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.createChildKanbanBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.createChildKanbanBoard(createChildKanbanBoardDto);

        return ResponseEntity.status(HttpStatus.OK).body(completeKanbanBoard);

    }

    @GetMapping("/api/v1/getKanbanBoardById")
    public ResponseEntity<CompleteKanbanBoard> getKanbanBoardById(@RequestParam String boardId,
                                                                  @RequestParam boolean primaryBoard,
                                                                  @RequestParam boolean homeBoard,
                                                                  HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.getKanbanBoardById()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.getKanbanBoardById(UUID.fromString(boardId), primaryBoard, homeBoard);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(completeKanbanBoard);
    }

    @GetMapping("/api/v1/getKanbanBoardByParentId")
    public ResponseEntity<CompleteKanbanBoard> getKanbanBoardByParentId(@RequestParam String parentId,
                                                                        @RequestParam boolean primaryBoard,
                                                                        @RequestParam boolean homeBoard,
                                                                        HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.getKanbanBoardByParentId()");
        log.info(parentId, primaryBoard, homeBoard);

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CompleteKanbanBoard completeKanbanBoard =
                kanbanBoardService.getKanbanBoardByParentId(
                        !parentId.isEmpty() ?
                                UUID.fromString(parentId) : UUID.fromString(userAccountDto.getId()),
                        primaryBoard,
                        homeBoard);

        if (completeKanbanBoard == null) {
            completeKanbanBoard = kanbanBoardService.getDefaultBoard(UUID.fromString(userAccountDto.getId()));
        }

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

    @DeleteMapping("/api/v1/deleteTask")
    public ResponseEntity<String> deleteTask(@RequestBody String taskId, HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.deleteTask()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final UUID deletedTaskId = kanbanBoardService.deleteTask(UUID.fromString(taskId));

        if (deletedTaskId == null) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
        }

        return ResponseEntity.ok().body("\"" + deletedTaskId + "\"");
    }

    @PostMapping("/api/v1/deleteBoard")
    public ResponseEntity<Void> deleteBoard(@RequestBody String boardId,
                                                 HttpServletRequest request) {

        log.info("➡️ Entered: KanbanBoardController.deleteBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        kanbanBoardService.deleteBoard(UUID.fromString(boardId));

        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/v1/setFavoriteBoard")
    public ResponseEntity<Void> setFavoriteBoard(@RequestBody @NonNull String boardId, HttpServletRequest request) {
        log.info("➡️ Entered: KanbanBoardController.setFavoriteBoard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
        }

        boolean boardSetAsFavorite = kanbanBoardService.setFavoriteBoard(
                UUID.fromString(userAccountDto.getId()), UUID.fromString(boardId)
        );

        return ResponseEntity.ok().build();
    }
}
