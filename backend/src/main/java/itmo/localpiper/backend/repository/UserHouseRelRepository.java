package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.UserHouseRel;

@Repository
public interface UserHouseRelRepository extends CrudRepository<UserHouseRel, Long>{
    @Override
    List<UserHouseRel> findAll();
}
