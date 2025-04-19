package com.kanular.server.dal.repositories;

import com.kanular.server.models.entities.KanbanCard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KanbanCardRepository extends CrudRepository<KanbanCard, UUID> {

    @NonNull
    @Override
    <S extends KanbanCard> S save(@NonNull S entity);

    @NonNull
    @Override
    <S extends KanbanCard> Iterable<S> saveAll(@NonNull Iterable<S> entities);

    @NonNull
    @Override
    Optional<KanbanCard> findById(@NonNull UUID uuid);


    @Override
    boolean existsById(@NonNull UUID uuid);

    @NonNull
    @Override
    Iterable<KanbanCard> findAll();

    @NonNull
    @Override
    Iterable<KanbanCard> findAllById(@NonNull Iterable<UUID> uuid);

    @NonNull
    List<KanbanCard> findAllByParentId(UUID parentId);

    @Modifying
    @Query("UPDATE KanbanCard u SET u.body = :body WHERE u.id = :id")
    int updateCardBody(@Param(value = "id") UUID id, @Param(value = "body") String body);

    @Modifying
    @Query("DELETE FROM KanbanCard k WHERE k.id = :id")
    int deleteByIdAndReturnCount(@Param("id") UUID id);

    @Override
    void delete(@NonNull KanbanCard entity);

    @Override
    void deleteAllById(@NonNull Iterable<? extends UUID> uuid);

    @Override
    void deleteAll(@NonNull Iterable<? extends KanbanCard> entities);

}
