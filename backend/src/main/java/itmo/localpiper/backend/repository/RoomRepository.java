package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Room;

@Repository
public interface RoomRepository extends CrudRepository<Room, Long>{
    @Override
    List<Room> findAll();
}
