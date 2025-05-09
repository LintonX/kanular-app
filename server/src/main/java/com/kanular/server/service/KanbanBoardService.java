package com.kanular.server.service;

import com.kanular.server.dal.repositories.KanbanBoardRepository;
import com.kanular.server.dal.repositories.KanbanCardRepository;
//import com.kanular.server.dal.repositories.KanbanColumnRepository;
import com.kanular.server.models.CompleteKanbanBoard;
import com.kanular.server.models.CreateChildKanbanBoardDto;
import com.kanular.server.models.Stage;
import com.kanular.server.models.entities.KanbanBoard;
import com.kanular.server.models.entities.KanbanCard;
//import com.kanular.server.models.entities.KanbanColumn;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;


@Service
@AllArgsConstructor
@Slf4j
public class KanbanBoardService {

    private final KanbanBoardRepository kanbanBoardRepository;
//    private final KanbanColumnRepository kanbanColumnRepository;
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
//        final KanbanColumn kanbanColumnToDo = kanbanColumnRepository.save(
//                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.TO_DO).build()
//        );
//        final KanbanColumn kanbanColumnInProgress = kanbanColumnRepository.save(
//                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.IN_PROGRESS).build()
//        );
//        final KanbanColumn kanbanColumnInReview = kanbanColumnRepository.save(
//                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.IN_REVIEW).build()
//        );
//        final KanbanColumn kanbanColumnDone = kanbanColumnRepository.save(
//                KanbanColumn.builder().parentId(kanbanBoard.getId()).stage(Stage.DONE).build()
//        );
        final KanbanCard kanbanCardTodo = kanbanCardRepository.save(
                KanbanCard.builder()
                        .parentId(kanbanBoard.getId())
                        .stage(Stage.TO_DO)
                        .title("\uD83D\uDC4B Welcome to Kanular!")
                        .body("This is your first Kanban board. Click on a card to edit it.")
                        .timeCreated(Timestamp.from(Instant.now()))
                        .build()
        );
        final KanbanCard kanbanCardInProgress = kanbanCardRepository.save(
                KanbanCard.builder()
                        .parentId(kanbanBoard.getId())
                        .stage(Stage.IN_PROGRESS)
                        .title("💡 Tip: Drag cards around")
                        .body("Try dragging this card to another column to get a feel for it.")
                        .timeCreated(Timestamp.from(Instant.now()))
                        .build()
        );

        return CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
//                .kanbanColumns(new KanbanColumn[]{kanbanColumnToDo, kanbanColumnInProgress, kanbanColumnInReview, kanbanColumnDone})
                .kanbanCards(new KanbanCard[]{kanbanCardTodo, kanbanCardInProgress})
                .build();
    }

    public KanbanBoard[] getAllPrimaryBoards(@NonNull UUID parentId) {
        return kanbanBoardRepository.findAllByParentIdAndPrimaryBoardIsTrue(parentId).toArray(new KanbanBoard[0]);
    }

    public CompleteKanbanBoard createKanbanBoard(UUID parentId, String title, boolean primaryBoard, boolean homeBoard) {
        final KanbanBoard kanbanBoard = kanbanBoardRepository.save(KanbanBoard.builder()
                .parentId(parentId)
                .primaryBoard(primaryBoard)
                .homeBoard(homeBoard)
                .title(title)
                .build()
        );

//        final List<KanbanColumn> kanbanColumns = kanbanColumnRepository.saveAll(Arrays.stream(Stage.values()).map(
//                stage -> KanbanColumn.builder()
//                        .stage(stage)
//                        .parentId(kanbanBoard.getId())
//                        .build()
//        ).toList());

        return CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
//                .kanbanColumns(kanbanColumns.toArray(new KanbanColumn[0]))
                .kanbanCards(new KanbanCard[]{})
                .build();
    }

    public CompleteKanbanBoard getKanbanBoardById(@NonNull final UUID boardId,
                                                        final boolean isPrimary,
                                                        final boolean isHome) {
        // home boards are always primary boards but primary boards are not always home boards
        log.info("➡️ Entered: KanbanBoardService.getKanbanBoardById()");

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

//        List<KanbanColumn> columns = StreamSupport
//                .stream(kanbanColumnRepository.findAllByParentId(kanbanBoard.getId()).spliterator(), false)
//                .toList();

//        List<UUID> columnIds = columns.stream()
//                .map(KanbanColumn::getId)
//                .toList();

        final List<KanbanCard> cards = kanbanCardRepository.findAllByParentId(kanbanBoard.getId());

        final CompleteKanbanBoard completeKanbanBoard = CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
//                .kanbanColumns(columns.toArray(new KanbanColumn[0]))
                .kanbanCards(cards.toArray(new KanbanCard[0]))
                .build();

        log.info("Completed kanban board = {}", completeKanbanBoard.toString());

        return completeKanbanBoard;
    }

    public CompleteKanbanBoard getKanbanBoardByParentId(@NonNull final UUID ownerId,
                                              final boolean isPrimary,
                                              final boolean isHome) {
        // home boards are always primary boards but primary boards are not always home boards
        log.info("➡️ Entered: KanbanBoardService.getKanbanBoardByParentId()");

        KanbanBoard kanbanBoard = null;

        if (isHome && isPrimary) {
            // get main home board
            kanbanBoard = kanbanBoardRepository.findByParentIdAndHomeBoardIsTrue(ownerId).orElse(null);
        } else if (!isHome && isPrimary) {
            // get a primary board
            kanbanBoard = kanbanBoardRepository.findByParentIdAndPrimaryBoardIsTrue(ownerId).orElse(null);
        } else {
            // get a child (nested) board
            kanbanBoard = kanbanBoardRepository.findByParentIdAndPrimaryBoardIsFalse(ownerId).orElse(null);
        }

        if (kanbanBoard == null) {
            return null;
        }

//        List<KanbanColumn> columns = StreamSupport
//                .stream(kanbanColumnRepository.findAllByParentId(kanbanBoard.getId()).spliterator(), false)
//                .toList();

//        List<UUID> columnIds = columns.stream()
//                .map(KanbanColumn::getId)
//                .toList();

        final List<KanbanCard> cards = kanbanCardRepository.findAllByParentId(kanbanBoard.getId());

        final CompleteKanbanBoard completeKanbanBoard = CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
//                .kanbanColumns(columns.toArray(new KanbanColumn[0]))
                .kanbanCards(cards.toArray(new KanbanCard[0]))
                .build();

        log.info("Completed kanban board = {}", completeKanbanBoard.toString());

        return completeKanbanBoard;
    }

    @Transactional
    public KanbanCard updateCardBody(@NonNull UUID cardId, @NonNull String body) {
        log.info("➡️ Entered: KanbanBoardService.updateCardBody()");

        int result = kanbanCardRepository.updateCardBody(cardId, body);

        log.info("Was card updated? {}", result == 1);

        if (result == 1) {
            return kanbanCardRepository.findById(cardId).orElseThrow(() -> new RuntimeException("Error gathering card."));
        }

        throw new RuntimeException("Did not update card");
    }

    public KanbanCard createTask(@NonNull KanbanCard kanbanCard) {
        log.info("➡️ Entered: KanbanBoardService.createTask()");

        return kanbanCardRepository.save(
                        KanbanCard.builder()
                        .parentId(kanbanCard.getParentId())
                        .title(kanbanCard.getTitle())
                        .body(kanbanCard.getBody())
                        .stage(kanbanCard.getStage())
                        .hasChildBoard(false)
                        .timeCreated(Timestamp.from(Instant.now()))
                        .build()
        );
    }

    @Transactional
    public void deleteBoard(@NonNull UUID boardId) {
        log.info("➡️ Entered: KanbanBoardService.deleteBoard()");
        final KanbanBoard boardToBeDeleted = kanbanBoardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Could not delete board: " + boardId + " as it was not found"));
//        final KanbanColumn[] columnsToBeDeleted = kanbanColumnRepository.findAllByParentId(boardToBeDeleted.getId()).toArray(new KanbanColumn[0]);
//        for (final KanbanColumn column: columnsToBeDeleted) {
            final KanbanCard[] cardsToBeDeleted = kanbanCardRepository.findAllByParentId(boardToBeDeleted.getId()).toArray(new KanbanCard[0]);
            for (final KanbanCard card: cardsToBeDeleted) {
                if (card.isHasChildBoard()) {
                    this.deleteTask(card.getId());
//                    final KanbanBoard childBoardToBeDeleted = kanbanBoardRepository.findByParentIdAndPrimaryBoardIsFalse(card.getId()).orElseThrow(() -> new RuntimeException("Did not find a child board of card: " + card.getId()));
//                    this.deleteBoard(childBoardToBeDeleted.getId());
                }
                kanbanCardRepository.deleteById(card.getId());
            }
//            kanbanColumnRepository.deleteById(column.getId());
//        }
        kanbanBoardRepository.deleteById(boardToBeDeleted.getId());
    }

    @Transactional
    public boolean setFavoriteBoard(@NonNull UUID parentId, @NonNull UUID boardId) {
        log.info("➡️ Entered: KanbanBoardService.setFavoriteBoard()");

        Optional<KanbanBoard> currentFavorite = kanbanBoardRepository.findByParentIdAndHomeBoardIsTrue(parentId);

        if (currentFavorite.isEmpty()) {
            return kanbanBoardRepository.updateBoardHome(boardId, true) == 1;
        }

        final int unfavoriteResult =
                kanbanBoardRepository.updateBoardHome(currentFavorite.get().getId(), false);
        final int favoriteResult =
                kanbanBoardRepository.updateBoardHome(boardId, true);

        return unfavoriteResult == 1 && favoriteResult == 1;
    }

    @Transactional
    public UUID deleteTask(@NonNull UUID taskId) {
        log.info("➡️ Entered: KanbanBoardService.deleteTask()");
        final KanbanCard cardToBeDeleted = kanbanCardRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Could not delete card as card was not found"));

        if (cardToBeDeleted.isHasChildBoard()) {
            final KanbanBoard childBoard =
                    kanbanBoardRepository.findByParentIdAndPrimaryBoardIsFalse(cardToBeDeleted.getId())
                            .orElseThrow(
                                    () -> new RuntimeException("Could not delete task as child board was not found")
                            );
            this.deleteBoard(childBoard.getId());
        }

        final int result = kanbanCardRepository.deleteByIdAndReturnCount(taskId);

        return result == 1 ? taskId : null;
    }

    @Transactional
    public CompleteKanbanBoard createChildKanbanBoard(@NonNull CreateChildKanbanBoardDto createChildKanbanBoardDto) {
        log.info("➡️ Entered: KanbanBoardService.createChildKanbanBoard()");
        final CompleteKanbanBoard completeKanbanBoard =
                this.createKanbanBoard(
                        UUID.fromString(createChildKanbanBoardDto.getParentId()),
                        createChildKanbanBoardDto.getTaskTitle(),
                        false,
                        false
                );
        final int wasCardUpdated = kanbanCardRepository.updateHasChild(
                UUID.fromString(createChildKanbanBoardDto.getParentId()),
                true
        );

        return completeKanbanBoard != null && wasCardUpdated == 1 ? completeKanbanBoard : null;
    }
}
