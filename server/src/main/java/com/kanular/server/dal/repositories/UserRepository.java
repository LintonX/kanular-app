package com.kanular.server.dal.repositories;

import com.kanular.server.models.entities.UserAccount;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserAccount, Long> {

    @NonNull
    @Override
    <S extends UserAccount> S save(@NonNull S entity);

    @NonNull
    @Override
    <S extends UserAccount> Iterable<S> saveAll(@NonNull Iterable<S> entities);

    @NonNull
    @Override
    Optional<UserAccount> findById(@NonNull Long aLong);

    @Override
    boolean existsById(@NonNull Long aLong);

    @NonNull
    @Override
    Iterable<UserAccount> findAll();

    @NonNull
    @Override
    Iterable<UserAccount> findAllById(@NonNull Iterable<Long> longs);

    @Override
    long count();

    @Override
    void deleteById(@NonNull Long aLong);

    @Override
    void delete(@NonNull UserAccount entity);

    // user defined queries
    Optional<UserAccount> findByEmail(@NonNull String email);
}
