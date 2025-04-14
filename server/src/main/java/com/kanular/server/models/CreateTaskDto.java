package com.kanular.server.models;

import com.kanular.server.models.entities.KanbanCard;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CreateTaskDto {
    private UUID parentId;
    private KanbanCard kanbanCard;
}
