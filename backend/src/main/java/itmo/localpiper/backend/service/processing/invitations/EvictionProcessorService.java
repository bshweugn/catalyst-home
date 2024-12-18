package itmo.localpiper.backend.service.processing.invitations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.KickRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.RoleViolationException;
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
public class EvictionProcessorService extends AbstractProcessor<RequestPair<KickRequest>, OperationResultResponse>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private TransactionalEvictUserService teus;

    @Override
    protected Object send(RequestPair<KickRequest> request) {
        String email = request.getEmail();
        Long userId = request.getBody().getUserId();
        Long houseId = request.getBody().getHouseId();
        User user = userRepository.findById(userId).get();
        UserHouseRel uhr1 = accessValidationService.validateAccess(email, houseId, AccessMode.STRICT);
        UserHouseRel uhr2 = accessValidationService.validateAccess(user.getEmail(), houseId, AccessMode.LIGHT);
        if (uhr1.getRole() == uhr2.getRole() || uhr2.getRole() == HouseOwnership.OWNER) throw new RoleViolationException("Can't evict user - permission denied!");
        teus.leaveHouse(uhr2);
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "User evicted!");
    }
    
}
