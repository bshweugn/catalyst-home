package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Device;

@Repository
public interface DeviceRepository extends CrudRepository<Long, Device>{
    
}
