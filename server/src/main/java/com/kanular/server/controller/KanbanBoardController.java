package com.kanular.server.controller;

import com.kanular.server.dal.repositories.KanbanCardRepository;
import com.kanular.server.models.CompleteKanbanBoard;
import com.kanular.server.models.HomeAndPrimaryBoards;
import com.kanular.server.models.UpdateCardBodyDto;
import com.kanular.server.models.UserAccountDto;
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
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@AllArgsConstructor
public class KanbanBoardController {

    private final KanbanCardRepository kanbanCardRepository;
    private KanbanBoardService kanbanBoardService;
    private JwtService jwtService;
    private CryptoUtil cryptoUtil;

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

    @GetMapping("/api/v1/hydrateDashboard")
    public ResponseEntity<HomeAndPrimaryBoards> hydrateDashboard(HttpServletRequest request) {

        // want the full home board and
        // want primary board shallow details
        log.info("➡️ Entered: KanbanBoardController.hydrateDashboard()");

        final String jwt = jwtService.extractJwtFromCookies(request);
        final UserAccountDto userAccountDto = jwtService.verifyJwt(jwt);

        if (userAccountDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        HomeAndPrimaryBoards hydratedDashboard =
                kanbanBoardService.hydrateDashboard(UUID.fromString(userAccountDto.getId()));

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

}
