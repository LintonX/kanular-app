package com.kanular.server.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CreateChildKanbanBoardDto {
    private String parentId;
    private String taskTitle;
}
