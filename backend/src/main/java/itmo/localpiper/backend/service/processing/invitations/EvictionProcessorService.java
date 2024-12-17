package itmo.localpiper.backend.service.processing.invitations;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.KickRequest;
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
public class EvictionProcessorService extends AbstractProcessor<Pair<String, KickRequest>, OperationResultResponse>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private UserHouseRelRepository uhrRepository;

    @Autowired
    private TransactionalEvictUserService teus;

    @Override
    protected Object send(Pair<String, KickRequest> request) {
        String email = request.getFirst();
        Long userId = request.getSecond().getUserId();
        Long houseId = request.getSecond().getHouseId();
        User host = userRepository.findByEmail(email).get();
        User user = userRepository.findById(userId).get();
        House house = houseRepository.findById(houseId).get();
        Optional<UserHouseRel> maybeUhr = uhrRepository.findByUserAndHouse(host, house);
        Optional<UserHouseRel> maybeUhr2 = uhrRepository.findByUserAndHouse(user, house);
        if (maybeUhr.isEmpty() || maybeUhr2.isEmpty()) throw new RoleViolationException("Can't evict user from this house!");
        HouseOwnership hostRole = maybeUhr.get().getRole();
        HouseOwnership role = maybeUhr2.get().getRole();
        if (hostRole == HouseOwnership.GUEST || role == HouseOwnership.OWNER || (hostRole == role)) throw new RoleViolationException("Can't evict user - permission denied!");
        teus.leaveHouse(maybeUhr2.get());
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "User evicted!");
    }
    
}
