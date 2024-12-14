package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.repository.RoomRepository;

@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FloorRepository floorRepository;

    public void rename(Long id, String newName) {
        Room room = roomRepository.findById(id).get();
        room.setName(newName);
        roomRepository.save(room);
    }

    public List<Room> read() {
        return roomRepository.findAll();
    }

    public Room create(String name, Long floorId) {
        Room room = new Room();
        Floor floor = floorRepository.findById(floorId).get();
        room.setName(name);
        room.setFloor(floor);

        roomRepository.save(room);
        return room;
    }

    public void delete(Long id) {
        roomRepository.deleteById(id);
    }
}
