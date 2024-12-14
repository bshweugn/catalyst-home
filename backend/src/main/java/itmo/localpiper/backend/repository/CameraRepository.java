package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Camera;

@Repository
public interface CameraRepository extends CrudRepository<Camera, Long>{
    @Override
    List<Camera> findAll();

    @Query("SELECT c FROM Camera c " +
           "JOIN c.room r " +
           "JOIN r.floor f " +
           "JOIN f.house h " +
           "WHERE h.id = :houseId")
    List<Camera> findAllByHouseId(@Param("houseId") Long houseId);
}
