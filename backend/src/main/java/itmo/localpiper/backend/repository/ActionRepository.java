package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Action;

@Repository
public interface ActionRepository extends CrudRepository<Action, Long>{
    @Override
    List<Action> findAll();
}
