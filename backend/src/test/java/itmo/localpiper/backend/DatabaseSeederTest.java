package itmo.localpiper.backend;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.LocationRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class DatabaseSeederTest {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Test
    public void testDatabaseSeeding() {
        // Verify Location
        List<Location> locations = locationRepository.findAll();
        assertEquals(1, locations.size());
        assertEquals("City Center", locations.get(0).getName());

        // Verify House
        List<House> houses = houseRepository.findAll();
        assertEquals(1, houses.size());
        assertEquals("House 1", houses.get(0).getName());

        // Verify Floor
        List<Floor> floors = floorRepository.findAll();
        assertEquals(1, floors.size());
        assertEquals("First Floor", floors.get(0).getName());

        // Verify Room
        List<Room> rooms = roomRepository.findAll();
        assertEquals(1, rooms.size());
        assertEquals("Living Room", rooms.get(0).getName());

        // Verify User
        List<User> users = userRepository.findAll();
        assertEquals(1, users.size());
        assertEquals("John Doe", users.get(0).getName());

        // Verify Device
        List<Device> devices = deviceRepository.findAll();
        System.out.println(devices.get(0).toJson());
        assertEquals(1, devices.size());
        assertEquals("Smart Lamp", devices.get(0).getName());
    }
}

