package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Floor;

@Repository
public interface FloorRepository extends CrudRepository<Floor, Long>{
    @Override
    List<Floor> findAll();
}
