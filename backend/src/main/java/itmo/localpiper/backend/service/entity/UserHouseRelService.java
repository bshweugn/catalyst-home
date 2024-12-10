package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;
import itmo.localpiper.backend.repository.UserRepository;

@Service
public class UserHouseRelService {
    
    @Autowired
    private UserHouseRelRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseRepository houseRepository;

    public List<UserHouseRel> read() {
        return repository.findAll();
    }

    public void create(Long userId, Long houseId, Boolean isResident) {
        UserHouseRel userHouseRel = new UserHouseRel();
        User user = userRepository.findById(userId).get();
        House house = houseRepository.findById(houseId).get();
        userHouseRel.setUser(user);
        userHouseRel.setHouse(house);
        userHouseRel.setIsResident(isResident);

        repository.save(userHouseRel);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
