package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Action;

@Repository
public interface ActionRepository extends CrudRepository<Action, Long>{
    
}
