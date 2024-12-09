package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.RoomRepository;

@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;

    public void rename(Long id, String newName) {
        Room room = roomRepository.findById(id).get();
        room.setName(newName);
        roomRepository.save(room);
    }

    public void delete(Long id) {
        roomRepository.deleteById(id);
    }
}
