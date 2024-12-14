package itmo.localpiper.backend.service.transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.service.entity.HouseService;
import itmo.localpiper.backend.service.entity.LocationService;
import itmo.localpiper.backend.service.entity.RoomService;
import itmo.localpiper.backend.service.entity.UserHouseRelService;

@Service
public class TransactionalCreateRecursiveEntityService {
    
    @Autowired
    private LocationService locationService;

    @Autowired
    private HouseService houseService;

    @Autowired
    private FloorService floorService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserHouseRelService uhrService;
    
    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public Room createRoom(User user, String roomName) {
        List<House> houses = uhrService.findHousesOwnedByUser(user);
        House house;
        if (houses.isEmpty()) {
            Long locationId = locationService.createOrReturn(0D, 0D);
            house = houseService.create("My House", locationId);
            uhrService.create(user.getId(), house.getId(), true);
        } else {
            house = houses.get(0);
        }
        List<Floor> floors = floorService.findFloorsByHouse(house);
        Floor floor;
        if (floors.isEmpty()) {
            floor = floorService.create("1st Floor", house.getId());
        } else {
            floor = floors.get(0);
        }        
        Room room = roomService.create(roomName, floor.getId());
        return room;
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public Floor createFloor(User user, String floorName) {
        List<House> houses = uhrService.findHousesOwnedByUser(user);
        House house;
        if (houses.isEmpty()) {
            Long locationId = locationService.createOrReturn(0D, 0D);
            house = houseService.create("My House", locationId);
            uhrService.create(user.getId(), house.getId(), true);
        } else {
            house = houses.get(0);
        }
        Floor floor = floorService.create(floorName, house.getId());
        return floor;
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public House createHouse(User user, String houseName, Double x, Double y) {
        Long locationId = locationService.createOrReturn(x, y);
        House house = houseService.create(houseName, locationId);
        uhrService.create(user.getId(), house.getId(), true);
        return house;
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public House createMappedHouse(User user, String houseName, Location location) {
        House house = houseService.create(houseName, location.getId());
        uhrService.create(user.getId(), house.getId(), true);
        return house;
    }


}
