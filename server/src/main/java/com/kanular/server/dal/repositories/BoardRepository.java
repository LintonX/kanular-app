package com.kanular.server.dal.repositories;

import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;

import com.kanular.server.models.entities.Board;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends CrudRepository<Board, Long> {

    @NonNull
    @Override
    <S extends Board> S save(@NonNull S entity);

    @NonNull
    @Override
    <S extends Board> Iterable<S> saveAll(@NonNull Iterable<S> entities);

    @NonNull
    @Override
    Optional<Board> findById(@NonNull Long aLong);

    @Override
    boolean existsById(@NonNull Long aLong);

    @NonNull
    @Override
    Iterable<Board> findAll();

    @NonNull
    @Override
    Iterable<Board> findAllById(@NonNull Iterable<Long> longs);

    @Override
    long count();

    @Override
    void deleteById(@NonNull Long aLong);


    @Override
    void delete(@NonNull Board entity);

    @Override
    void deleteAllById(@NonNull Iterable<? extends Long> longs);
}
