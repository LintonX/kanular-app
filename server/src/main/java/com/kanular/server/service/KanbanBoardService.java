package com.kanular.server.service;

import com.kanular.server.dal.repositories.KanbanBoardRepository;
import com.kanular.server.dal.repositories.KanbanCardRepository;
import com.kanular.server.dal.repositories.KanbanColumnRepository;
import com.kanular.server.models.CompleteKanbanBoard;
import com.kanular.server.models.HomeAndPrimaryBoards;
import com.kanular.server.models.Stage;
import com.kanular.server.models.entities.KanbanBoard;
import com.kanular.server.models.entities.KanbanCard;
import com.kanular.server.models.entities.KanbanColumn;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
@Slf4j
public class KanbanBoardService {

    private final KanbanBoardRepository kanbanBoardRepository;
    private final KanbanColumnRepository kanbanColumnRepository;
    private final KanbanCardRepository kanbanCardRepository;

    @Transactional
    public CompleteKanbanBoard getDefaultBoard(@NonNull final UUID ownerId) {
        log.info("➡️ Entered: KanbanBoardService.getDefaultBoard()");

        final KanbanBoard kanbanBoard = kanbanBoardRepository.save(
                KanbanBoard.builder()
                        .parentId(ownerId)
                        .title("Welcome Board")
                        .homeBoard(true)
                        .primaryBoard(true)
                        .build()
        );
        final KanbanColumn kanbanColumnToDo = kanbanColumnRepository.save(
                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.TO_DO).build()
        );
        final KanbanColumn kanbanColumnInProgress = kanbanColumnRepository.save(
                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.IN_PROGRESS).build()
        );
        final KanbanColumn kanbanColumnInReview = kanbanColumnRepository.save(
                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.IN_REVIEW).build()
        );
        final KanbanColumn kanbanColumnDone = kanbanColumnRepository.save(
                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.DONE).build()
        );
        final KanbanCard kanbanCardTodo = kanbanCardRepository.save(
                KanbanCard.builder()
                        .parentId(kanbanColumnToDo.getId())
                        .stage(Stage.TO_DO)
                        .title("\uD83D\uDC4B Welcome to Kanular!")
                        .body("This is your first Kanban board. Click on a card to edit it.")
                        .timeCreated(Timestamp.from(Instant.now()))
                        .build()
        );
        final KanbanCard kanbanCardInProgress = kanbanCardRepository.save(
                KanbanCard.builder()
                        .parentId(kanbanColumnInProgress.getId())
                        .stage(Stage.IN_PROGRESS)
                        .title("💡 Tip: Drag cards around")
                        .body("Try dragging this card to another column to get a feel for it.")
                        .timeCreated(Timestamp.from(Instant.now()))
                        .build()
        );

        return CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
                .kanbanColumns(new KanbanColumn[]{kanbanColumnToDo, kanbanColumnInProgress, kanbanColumnInReview, kanbanColumnDone})
                .kanbanCards(new KanbanCard[]{kanbanCardTodo, kanbanCardInProgress})
                .build();
    }

    public CompleteKanbanBoard createKanbanBoard(@NonNull final UUID parentId,
                                                 @NonNull final String title,
                                                 boolean isPrimary) {
        log.info("➡️ Entered: KanbanBoardService.createKanbanBoard()");

        KanbanBoard kanbanBoard = null;

        if (isPrimary) {
//            kanbanBoard = kanbanBoardRepository.save(KanbanBoard.builder()
//                    .parentId(parentId)
//                    .primaryBoard(true)
//                    .homeBoard(false)
//                    .title(title)
//                    .build()
//            );
            return createKanbanBoard(parentId, title, true, false);
        } else {
//            kanbanBoard = kanbanBoardRepository.save(KanbanBoard.builder()
//                    .parentId(parentId)
//                    .primaryBoard(false)
//                    .homeBoard(false)
//                    .build()
//            );
            return createKanbanBoard(parentId, title, false, false);
        }
    }

    public CompleteKanbanBoard createKanbanBoard(UUID parentId, String title, boolean primaryBoard, boolean homeBoard) {
        final KanbanBoard kanbanBoard = kanbanBoardRepository.save(KanbanBoard.builder()
                .parentId(parentId)
                .primaryBoard(primaryBoard)
                .homeBoard(homeBoard)
                .title(title)
                .build()
        );

        final List<KanbanColumn> kanbanColumns = kanbanColumnRepository.saveAll(Arrays.stream(Stage.values()).map(
                stage -> KanbanColumn.builder()
                        .stage(stage)
                        .parentId(kanbanBoard.getId())
                        .build()
        ).toList());

        return CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
                .kanbanColumns(kanbanColumns.toArray(new KanbanColumn[0]))
                .kanbanCards(new KanbanCard[]{})
                .build();
    }

    public CompleteKanbanBoard getKanbanBoard(@NonNull final UUID boardId,
                                              final boolean isPrimary,
                                              final boolean isHome) {
        // home boards are always primary boards but primary boards are not always home boards
        log.info("➡️ Entered: KanbanBoardService.getKanbanBoard()");

        KanbanBoard kanbanBoard = null;

        if (isHome && isPrimary) {
            // get main home board
            kanbanBoard = kanbanBoardRepository.findByIdAndHomeBoardIsTrue(boardId)
                    .orElseThrow(() -> new RuntimeException("Error gathering home board."));
        } else if (!isHome && isPrimary) {
            // get a primary board
            kanbanBoard = kanbanBoardRepository.findByIdAndPrimaryBoardIsTrue(boardId)
                    .orElseThrow(() -> new RuntimeException("Error gathering primary board."));
        } else {
            // get a child (nested) board
            kanbanBoard = kanbanBoardRepository.findByIdAndPrimaryBoardIsFalse(boardId)
                    .orElseThrow(() -> new RuntimeException("Error gathering child board."));
        }

        List<KanbanColumn> columns = StreamSupport
                .stream(kanbanColumnRepository.findAllByParentId(kanbanBoard.getId()).spliterator(), false)
                .toList();

        List<UUID> columnIds = columns.stream()
                .map(KanbanColumn::getId)
                .toList();

        List<KanbanCard> cards = columnIds.stream()
                .flatMap(columnId -> kanbanCardRepository.findAllByParentId(columnId).stream())
                .toList();

        final CompleteKanbanBoard completeKanbanBoard = CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
                .kanbanColumns(columns.toArray(new KanbanColumn[0]))
                .kanbanCards(cards.toArray(new KanbanCard[0]))
                .build();

        log.info("Completed kanban board = {}", completeKanbanBoard.toString());

        return completeKanbanBoard;
    }

    public HomeAndPrimaryBoards hydrateDashboard(@NonNull final UUID ownerId) {
        log.info("➡️ Entered: KanbanBoardService.hydrateDashboard()");

        final KanbanBoard homeBoard = kanbanBoardRepository.findByParentIdAndHomeBoardIsTrue(ownerId)
                .orElseThrow(() -> new RuntimeException("Error gathering home board."));

        log.info("Home board found: {}", homeBoard.toString());

        final CompleteKanbanBoard completeHomeBoard = getKanbanBoard(homeBoard.getId(), true, true);

        log.info("Complete home board: {}", completeHomeBoard);

        final List<KanbanBoard> primaryBoards = kanbanBoardRepository.findAllByParentIdAndPrimaryBoardIsTrue(ownerId);

        log.info("Primary boards found: {}", primaryBoards.toString());

        return HomeAndPrimaryBoards.builder()
                .homeBoard(completeHomeBoard)
                .primaryBoards(primaryBoards.toArray(new KanbanBoard[0]))
                .build();
    }

    @Transactional
    public KanbanCard updateCardBody(@NonNull UUID cardId, @NonNull String body) {
        log.info("➡️ Entered: KanbanBoardService.saveBoard()");

        int result = kanbanCardRepository.updateCardBody(cardId, body);

        if (result == 1) {
            return kanbanCardRepository.findById(cardId).orElseThrow(() -> new RuntimeException("Error gathering card."));
        }

        throw new RuntimeException("Did not update card");
    }

}
