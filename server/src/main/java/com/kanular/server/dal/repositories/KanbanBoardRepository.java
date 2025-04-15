package com.kanular.server.dal.repositories;

import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;

import com.kanular.server.models.entities.KanbanBoard;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KanbanBoardRepository extends CrudRepository<KanbanBoard, UUID> {

    @NonNull
    @Override
    <S extends KanbanBoard> S save(@NonNull S entity);

    @NonNull
    @Override
    <S extends KanbanBoard> Iterable<S> saveAll(@NonNull Iterable<S> entities);

    @NonNull
    @Override
    Optional<KanbanBoard> findById(@NonNull UUID uuid);

    @NonNull
    Optional<KanbanBoard> findByIdAndHomeBoardIsTrue(@NonNull UUID uuid);

    @NonNull
    Optional<KanbanBoard> findByParentIdAndHomeBoardIsTrue(@NonNull UUID uuid);

    @NonNull
    Optional<KanbanBoard> findByIdAndPrimaryBoardIsTrue(@NonNull UUID uuid);

    @NonNull
    Optional<KanbanBoard> findByIdAndPrimaryBoardIsFalse(@NonNull UUID uuid);

    @Override
    boolean existsById(@NonNull UUID uuid);

    @NonNull
    @Override
    Iterable<KanbanBoard> findAll();

    @NonNull
    @Override
    Iterable<KanbanBoard> findAllById(@NonNull Iterable<UUID> uuids);

    List<KanbanBoard> findAllByParentIdAndPrimaryBoardIsTrue(@NonNull UUID parentId);

    Optional<KanbanBoard> findByParentIdAndPrimaryBoardIsTrue(@NonNull UUID parentId);

    Optional<KanbanBoard> findByParentIdAndPrimaryBoardIsFalse(@NonNull UUID parentId);

    @Override
    void deleteById(@NonNull UUID uuid);

    void deleteByParentId(@NonNull UUID uuid);

}
