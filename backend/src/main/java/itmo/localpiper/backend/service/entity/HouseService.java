package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.LocationRepository;


@Service
public class HouseService {
    
    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private LocationRepository locationRepository;

    public void rename(Long id, String newName) {
        House house = houseRepository.findById(id).get();
        house.setName(newName);
        houseRepository.save(house);
    }

    public void create(String name, Long locationId) {
        House house = new House();
        Location location = locationRepository.findById(locationId).get();
        house.setName(name);
        house.setLocation(location);

        houseRepository.save(house);
    }

    public void delete(Long id) {
        houseRepository.deleteById(id);
    }
}
