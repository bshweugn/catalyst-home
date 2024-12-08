package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.UserDeviceActionRel;

@Repository
public interface UserDeviceActionRelRepository extends CrudRepository<UserDeviceActionRel, Long>{
    
}
