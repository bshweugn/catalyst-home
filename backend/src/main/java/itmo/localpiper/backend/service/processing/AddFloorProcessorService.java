package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.homeutils.AddFloorRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.service.transactional.TransactionalCreateRecursiveEntityService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddFloorProcessorService extends AbstractProcessor<RequestPair<AddFloorRequest>, HoldableResultResponse<Floor>>{

    @Autowired
    private FloorService floorService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private TransactionalCreateRecursiveEntityService tcres;

    @Override
    protected Object send(RequestPair<AddFloorRequest> request) {
        String email = request.getEmail();
        String name = request.getBody().getName();
        Long houseId = request.getBody().getHouseId();
        if (houseId == null) {
            User user = userRepository.findByEmail(email).get();
            return tcres.createFloor(user, name);
        }
        accessValidationService.validateAccess(email, houseId, AccessMode.STRICT);
        return floorService.create(name, houseId);
    }

    @Override
    protected HoldableResultResponse<Floor> pack(Object result) {
        return new HoldableResultResponse<>((Floor)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "New Floor added!"));
    }
    
}
