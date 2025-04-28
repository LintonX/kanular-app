//package com.kanular.server.dal.repositories;
//
//import com.kanular.server.models.entities.KanbanColumn;
//import lombok.NonNull;
//import org.springframework.data.repository.CrudRepository;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//public interface KanbanColumnRepository extends CrudRepository<KanbanColumn, UUID> {
//
//    @NonNull
//    @Override
//    <S extends KanbanColumn> S save(@NonNull S entity);
//
//    @NonNull
//    @Override
//    <S extends KanbanColumn> List<S> saveAll(@NonNull Iterable<S> entities);
//
//    @NonNull
//    Optional<KanbanColumn> findByParentId(@NonNull UUID uuid);
//
//    @NonNull
//    List<KanbanColumn> findAllByParentId(@NonNull UUID uuid);
//
//    @NonNull
//    @Override
//    Optional<KanbanColumn> findById(@NonNull UUID uuid);
//
//    @Override
//    boolean existsById(@NonNull UUID uuid);
//
//    @NonNull
//    @Override
//    Iterable<KanbanColumn> findAll();
//
//    @NonNull
//    @Override
//    Iterable<KanbanColumn> findAllById(@NonNull Iterable<UUID> uuids);
//
//    @Override
//    long count();
//
//    @Override
//    void deleteById(@NonNull UUID uuid);
//
//    @Override
//    void delete(@NonNull KanbanColumn entity);
//
//    @Override
//    void deleteAllById(@NonNull Iterable<? extends UUID> uuids);
//
//    @Override
//    void deleteAll(@NonNull Iterable<? extends KanbanColumn> entities);
//
//    @Override
//    void deleteAll();
//}
