package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.repository.HouseRepository;

@Service
public class FloorService {
    
    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private HouseRepository houseRepository;

    public void rename(Long id, String newName) {
        Floor floor = floorRepository.findById(id).get();
        floor.setName(newName);
        floorRepository.save(floor);
    }

    public void create(String name, Long houseId) {
        Floor floor = new Floor();
        House house = houseRepository.findById(houseId).get();
        floor.setName(name);
        floor.setHouse(house);

        floorRepository.save(floor);
    }

    public void delete(Long id) {
        floorRepository.deleteById(id);
    }
}
