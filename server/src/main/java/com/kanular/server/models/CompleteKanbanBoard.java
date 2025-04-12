package com.kanular.server.models;


import com.kanular.server.models.entities.KanbanBoard;
import com.kanular.server.models.entities.KanbanCard;
import com.kanular.server.models.entities.KanbanColumn;
import lombok.*;

import java.util.Arrays;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompleteKanbanBoard {

    private KanbanBoard kanbanBoard;
    private KanbanColumn[] kanbanColumn;
    private KanbanCard[] kanbanCard;

    @Override
    public String toString() {
        return "board: " + kanbanBoard.toString() +
                ", columns: " + Arrays.toString(kanbanColumn) +
                ", cards: " + Arrays.toString(kanbanCard);
    }

}
