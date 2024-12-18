package itmo.localpiper.backend.service.processing.invitations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.LeaveRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalEvictUserService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class LeaveProcessorService extends AbstractProcessor<RequestPair<LeaveRequest>, OperationResultResponse>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private TransactionalEvictUserService teus;

    @Override
    protected Object send(RequestPair<LeaveRequest> request) {
        String email = request.getEmail();
        Long houseId = request.getBody().getHouseId();
        UserHouseRel uhr = accessValidationService.validateAccess(email, houseId, AccessMode.NONE);
        if (uhr == null) return null;
        if (uhr.getRole() == HouseOwnership.OWNER) {
            // new owner required, else the house is deleted
            Long newOwnerId = request.getBody().getNewOwnerId();
            if (newOwnerId == null) {
                teus.leaveHouseWithDeletion(uhr.getHouse().getId());
                return null;
            } 
            User newOwner = userRepository.findById(newOwnerId).get();
            accessValidationService.validateAccess(newOwner.getEmail(), houseId, AccessMode.STRICT);
            teus.leaveHouseWithReassignment(uhr, newOwner);
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
