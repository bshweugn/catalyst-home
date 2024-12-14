package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Device;

@Repository
public interface DeviceRepository extends CrudRepository<Device, Long>{
    @Override
    List<Device> findAll();

    @Query("SELECT d FROM Device d " +
           "JOIN d.room r " +
           "JOIN r.floor f " +
           "JOIN f.house h " +
           "WHERE h.id = :houseId")
    List<Device> findAllByHouseId(@Param("houseId") Long houseId);
}
