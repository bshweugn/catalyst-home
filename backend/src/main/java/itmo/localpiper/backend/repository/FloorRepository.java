package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Floor;

@Repository
public interface FloorRepository extends CrudRepository<Long, Floor>{
    
}
