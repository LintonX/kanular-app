package com.kanular.server.dal.repositories;

import com.kanular.server.models.entities.KanbanCard;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;

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

    @Override
    long count();

    @Override
    void deleteById(@NonNull UUID uuid);

    @Override
    void delete(@NonNull KanbanCard entity);

    @Override
    void deleteAllById(@NonNull Iterable<? extends UUID> uuid);

    @Override
    void deleteAll(@NonNull Iterable<? extends KanbanCard> entities);

    @Override
    void deleteAll();
}
