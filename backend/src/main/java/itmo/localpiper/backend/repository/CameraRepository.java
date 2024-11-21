package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Camera;

@Repository
public interface CameraRepository extends CrudRepository<Long, Camera>{
    
}
