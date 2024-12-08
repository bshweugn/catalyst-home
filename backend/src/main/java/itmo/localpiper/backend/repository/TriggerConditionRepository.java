package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.TriggerCondition;

@Repository
public interface TriggerConditionRepository extends CrudRepository<TriggerCondition, Long>{
    
}
