package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Script;

@Repository
public interface ScriptRepository extends CrudRepository<Script, Long>{
    
}
