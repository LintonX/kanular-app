package com.kanular.server.service;

import com.kanular.server.dal.repositories.KanbanBoardRepository;
import com.kanular.server.dal.repositories.KanbanCardRepository;
import com.kanular.server.dal.repositories.KanbanColumnRepository;
import com.kanular.server.models.CompleteKanbanBoard;
import com.kanular.server.models.entities.KanbanBoard;
import com.kanular.server.models.entities.KanbanCard;
import com.kanular.server.models.entities.KanbanColumn;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
@Slf4j
public class KanbanBoardService {

    private final KanbanBoardRepository kanbanBoardRepository;
    private final KanbanColumnRepository kanbanColumnRepository;
    private final KanbanCardRepository kanbanCardRepository;

    public CompleteKanbanBoard initHomeKanbanBoard(@NonNull final UUID ownerId) {
        log.info("➡️ Entered: KanbanBoardService.initHomeKanbanBoard()");

        final KanbanBoard initHomeKanbanBoard = kanbanBoardRepository.save(KanbanBoard.builder()
                .parentId(ownerId)
                .homeBoard(true)
                .primaryBoard(true)
                .build());

        return CompleteKanbanBoard.builder().kanbanBoard(initHomeKanbanBoard).build();
    }

    public CompleteKanbanBoard createKanbanBoard(@NonNull final UUID parentId,
                                                 boolean isPrimary) {
        log.info("➡️ Entered: KanbanBoardService.createKanbanBoard()");

        KanbanBoard kanbanBoard = null;

        if (isPrimary) {
            kanbanBoard = kanbanBoardRepository.save(KanbanBoard.builder()
                    .parentId(parentId)
                    .primaryBoard(true)
                    .homeBoard(false)
                    .build()
            );
        } else {
            kanbanBoard = kanbanBoardRepository.save(KanbanBoard.builder()
                    .parentId(parentId)
                    .primaryBoard(false)
                    .homeBoard(false)
                    .build()
            );
        }

        return CompleteKanbanBoard.builder().kanbanBoard(kanbanBoard).build();

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

        List<KanbanCard> cards = StreamSupport
                .stream(kanbanCardRepository.findAllById(columnIds).spliterator(), false)
                .toList();

        final CompleteKanbanBoard completeKanbanBoard = CompleteKanbanBoard.builder()
                .kanbanBoard(kanbanBoard)
                .kanbanColumn(columns.toArray(new KanbanColumn[0]))
                .kanbanCard(cards.toArray(new KanbanCard[0]))
                .build();

        log.info("Completed kanban board = {}", completeKanbanBoard.toString());

        return completeKanbanBoard;
    }

    public Pair<CompleteKanbanBoard, KanbanBoard[]> hydrateDashboard(@NonNull final UUID ownerId) {
        log.info("➡️ Entered: KanbanBoardService.hydrateDashboard()");

        final KanbanBoard homeBoard = kanbanBoardRepository.findByIdAndHomeBoardIsTrue(ownerId)
                .orElseThrow(() -> new RuntimeException("Error gathering home board."));

        final List<KanbanBoard> primaryBoards = kanbanBoardRepository.findAllByParentIdAndPrimaryBoardIsTrue(ownerId);

        return Pair.of(
                CompleteKanbanBoard.builder().kanbanBoard(homeBoard).build(),
                primaryBoards.toArray(new KanbanBoard[0])
        );

    }

}
