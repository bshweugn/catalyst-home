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
import itmo.localpiper.backend.util.enums.HouseOwnership;

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

    public void create(Long userId, Long houseId, HouseOwnership role) {
        UserHouseRel userHouseRel = new UserHouseRel();
        User user = userRepository.findById(userId).get();
        House house = houseRepository.findById(houseId).get();
        userHouseRel.setUser(user);
        userHouseRel.setHouse(house);
        userHouseRel.setRole(role);

        repository.save(userHouseRel);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<House> findHousesOwnedByUser(User user) {
        return repository.findAllHousesWhereUserIsResident(user.getId());
    }

    public List<House> findHousesMappedToUser(User user) {
        return repository.findAllHousesByUser(user.getId());
    }

    public List<User> findUsersMappedToHouse(House house) {
        return repository.findAllUsersByHouse(house.getId());
    }
}
