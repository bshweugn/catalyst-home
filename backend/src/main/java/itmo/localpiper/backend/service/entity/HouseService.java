package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.repository.HouseRepository;


@Service
public class HouseService {
    
    @Autowired
    private HouseRepository houseRepository;

    public void rename(Long id, String newName) {
        House house = houseRepository.findById(id).get();
        house.setName(newName);
        houseRepository.save(house);
    }
}
