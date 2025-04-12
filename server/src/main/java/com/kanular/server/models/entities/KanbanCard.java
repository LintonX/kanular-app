package com.kanular.server.models.entities;

import com.kanular.server.models.Stage;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanbanCard {

    @Id
    @Column(updatable = false, nullable = false)
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private UUID parentId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = true)
    private String body;

    @Column(nullable = false)
    private Stage stage;

    @Column(nullable = false)
    private boolean hasChildBoard;

    @Column(nullable = false)
    private Timestamp timeCreated = Timestamp.from(Instant.now());

}
