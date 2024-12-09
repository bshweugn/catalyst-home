package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.House;

@Repository
public interface HouseRepository extends CrudRepository<House, Long>{
    @Override
    List<House> findAll();
}
