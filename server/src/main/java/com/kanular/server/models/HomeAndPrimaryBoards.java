package com.kanular.server.models;

import com.kanular.server.models.entities.KanbanBoard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class HomeAndPrimaryBoards {
    private final CompleteKanbanBoard homeBoard;
    private final KanbanBoard[] primaryBoards;
}
