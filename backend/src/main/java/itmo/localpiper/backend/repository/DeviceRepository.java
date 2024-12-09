package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Device;

@Repository
public interface DeviceRepository extends CrudRepository<Device, Long>{
    @Override
    List<Device> findAll();
}
