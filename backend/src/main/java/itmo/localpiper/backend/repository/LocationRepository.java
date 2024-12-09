package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Location;

@Repository
public interface LocationRepository extends CrudRepository<Location, Long>{
    @Override
    List<Location> findAll();
}
