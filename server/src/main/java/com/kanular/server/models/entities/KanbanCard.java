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
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private UUID parentId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private Stage stage;

    @Column(nullable = false)
    private boolean hasChildBoard;

    @Builder.Default
    @Column(nullable = false)
    private Timestamp timeCreated = Timestamp.from(Instant.now());

}
