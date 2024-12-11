package itmo.localpiper.backend.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.UserData;

@Repository
public interface UserDataRepository extends CrudRepository<UserData, Long>{
    Optional<UserData> findByLogin(String login);
}
