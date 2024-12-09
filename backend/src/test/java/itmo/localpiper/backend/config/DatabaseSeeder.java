package itmo.localpiper.backend.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

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
import lombok.AllArgsConstructor;
import lombok.Data;

@Component
@Profile("test")
@Data
@AllArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final LocationRepository locationRepository;
    private final HouseRepository houseRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create Location
        
        Location location = Location.builder()
                .name("City Center")
                .xCoordinate(50.4501)
                .yCoordinate(30.5234)
                .build();
        locationRepository.save(location);

        // Create House
        House house = House.builder()
                .name("House 1")
                .location(location)
                .build();
        houseRepository.save(house);

        // Create Floor
        Floor floor = Floor.builder()
                .name("First Floor")
                .house(house)
                .build();
        floorRepository.save(floor);

        // Create Room
        Room room = Room.builder()
                .name("Living Room")
                .floor(floor)
                .build();
        roomRepository.save(room);

        // Create User
        User user = User.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .isResident(true)
                .houses(List.of(house))
                .build();
        userRepository.save(user);

        Map<String, Object> mp = new HashMap<>();
        mp.put("BRIGHTNESS", 75);
        // Create Device
        Device device = Device.builder()
                .name("Smart Lamp")
                .deviceType("LAMP_01_0001")
                .status("OFF")
                .batteryLevel(100)
                .charging(false)
                .features(mp)
                .room(room)
                .build();
        deviceRepository.save(device);
    }
}

