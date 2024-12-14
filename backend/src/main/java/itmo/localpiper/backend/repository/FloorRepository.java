package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Floor;

@Repository
public interface FloorRepository extends CrudRepository<Floor, Long>{
    @Override
    List<Floor> findAll();

    @Query("SELECT f FROM Floor f WHERE f.house.id = :houseId")
    List<Floor> findAllFloorsByHouseId(@Param("houseId") Long houseId);
}
