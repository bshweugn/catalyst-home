package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.repository.FloorRepository;

@Service
public class FloorService {
    
    @Autowired
    private FloorRepository floorRepository;

    public void rename(Long id, String newName) {
        Floor floor = floorRepository.findById(id).get();
        floor.setName(newName);
        floorRepository.save(floor);
    }
}
