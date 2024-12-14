package itmo.localpiper.backend.service.processing.invitations;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.LeaveRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.RoleViolationException;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalEvictUserService;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class LeaveProcessor extends AbstractProcessor<Pair<String, LeaveRequest>, OperationResultResponse>{

    @Autowired
    private UserHouseRelRepository uhrRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private TransactionalEvictUserService teus;

    @Override
    protected Object send(Pair<String, LeaveRequest> request) {
        String email = request.getFirst();
        Long houseId = request.getSecond().getHouseId();
        User user = userRepository.findByEmail(email).get();
        House house = houseRepository.findById(houseId).get();
        Optional<UserHouseRel> maybeUhr = uhrRepository.findByUserAndHouse(user, house);
        if (maybeUhr.isEmpty()) return null;
        UserHouseRel uhr = maybeUhr.get();
        HouseOwnership role = uhr.getRole();
        if (role == HouseOwnership.OWNER) {
            // new owner required, else the house is deleted
            Long newOwnerId = request.getSecond().getNewOwnerId();
            if (newOwnerId == null) {
                teus.leaveHouseWithDeletion(house.getId());
                return null;
            } else if (uhrRepository.findByUserAndHouse(userRepository.findById(newOwnerId).get(), house).get().getRole() == HouseOwnership.GUEST){
                throw new RoleViolationException("Can't assign Guest as new Owner!");
            }
            teus.leaveHouseWithReassignment(uhr, userRepository.findById(newOwnerId).get());
            return null;
        }
        teus.leaveHouse(uhr);
        return null;

    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "User left the house!");
    }
    
}
