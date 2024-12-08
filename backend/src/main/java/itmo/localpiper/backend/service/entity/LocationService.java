package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.repository.LocationRepository;

@Service
public class LocationService {
    
    @Autowired
    private LocationRepository locationRepository;

    public void rename(Long id, String newName) {
        Location location = locationRepository.findById(id).get();
        location.setName(newName);
        locationRepository.save(location);
    }
    
}
