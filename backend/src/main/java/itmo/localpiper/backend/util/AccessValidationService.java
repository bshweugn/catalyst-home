package itmo.localpiper.backend.util;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.exceptions.RoleViolationException;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.HouseOwnership;

@Service
public class AccessValidationService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private UserHouseRelRepository uhrRepository;

    public UserHouseRel validateAccess(String email, Long houseId, AccessMode mode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));
        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new IllegalArgumentException("House not found for id: " + houseId));

        Optional<UserHouseRel> maybeUhr = uhrRepository.findByUserAndHouse(user, house);

        if (mode != AccessMode.NONE) {
            if (maybeUhr.isEmpty()) throw new RoleViolationException("Relationship not found - permission denied");
            if (mode == AccessMode.STRICT && maybeUhr.get().getRole() == HouseOwnership.GUEST) throw new RoleViolationException("Permission denied - insufficient role");
        }
        return maybeUhr.orElse(null);
    }
}
