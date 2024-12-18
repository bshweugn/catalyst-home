package itmo.localpiper.backend.service.processing;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.homeutils.AddFloorRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.RoleViolationException;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.service.transactional.TransactionalCreateRecursiveEntityService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddFloorProcessorService extends AbstractProcessor<RequestPair<AddFloorRequest>, HoldableResultResponse<Floor>>{

    @Autowired
    private FloorService floorService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private UserHouseRelRepository uhrRepository;

    @Autowired
    private TransactionalCreateRecursiveEntityService tcres;

    @Override
    protected Object send(RequestPair<AddFloorRequest> request) {
        String email = request.getEmail();
        String name = request.getBody().getName();
        Long houseId = request.getBody().getHouseId();
        User user = userRepository.findByEmail(email).get();
        if (houseId == null) {
            return tcres.createFloor(user, name);
        }
        House house = houseRepository.findById(houseId).get();
        Optional<UserHouseRel> maybeUhr = uhrRepository.findByUserAndHouse(user, house);
        if (maybeUhr.isEmpty() || maybeUhr.get().getRole() == HouseOwnership.GUEST) throw new RoleViolationException("Can't add floor - permission denied");
        return floorService.create(name, houseId);
    }

    @Override
    protected HoldableResultResponse<Floor> pack(Object result) {
        return new HoldableResultResponse<>((Floor)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "New Floor added!"));
    }
    
}
