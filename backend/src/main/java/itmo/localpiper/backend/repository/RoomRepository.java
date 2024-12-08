package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Room;

@Repository
public interface RoomRepository extends CrudRepository<Room, Long>{
    
}
