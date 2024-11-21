package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Location;

@Repository
public interface LocationRepository extends CrudRepository<Long, Location>{
    
}
