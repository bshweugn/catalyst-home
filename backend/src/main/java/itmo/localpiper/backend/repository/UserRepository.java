package itmo.localpiper.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    @Override
    List<User> findAll();

    Optional<User> findByEmail(String email);
}
