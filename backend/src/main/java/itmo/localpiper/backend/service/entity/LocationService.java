package itmo.localpiper.backend.service.entity;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.repository.LocationRepository;

@Service
public class LocationService {
    
    @Autowired
    private LocationRepository locationRepository;

    public Long createOrReturn(Double x, Double y) {
        Optional<Location> maybeLocation = locationRepository.findByXAndY(x, y);
        if (maybeLocation.isPresent()) {
            return maybeLocation.get().getId();
        }
        return create("newLocation", x, y).getId();
    }

    public void rename(Long id, String newName) {
        Location location = locationRepository.findById(id).get();
        location.setName(newName);
        locationRepository.save(location);
    }

    public List<Location> read() {
        return locationRepository.findAll();
    }

    public Location create(String name, Double xCoordinate, Double yCoordinate) {
        Location location = new Location();
        location.setName(name);
        location.setX(xCoordinate);
        location.setY(yCoordinate);

        locationRepository.save(location);
        return location;
    }
    
    public void delete(Long id) {
        locationRepository.deleteById(id);
    }

    
}
