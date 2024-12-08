package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    
}
