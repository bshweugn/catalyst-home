package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.AddFloorRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.service.transactional.TransactionalCreateRecursiveEntityService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddFloorProcessor extends AbstractProcessor<Pair<String,AddFloorRequest>, HoldableResultResponse<Floor>>{

    @Autowired
    private FloorService floorService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionalCreateRecursiveEntityService tcres;

    @Override
    protected Object send(Pair<String,AddFloorRequest> request) {
        String email = request.getFirst();
        String name = request.getSecond().getName();
        Long houseId = request.getSecond().getHouseId();
        if (houseId == null) {
            User user = userRepository.findByEmail(email).get();
            return tcres.createFloor(user, name);
        }
        return floorService.create(name, houseId);
    }

    @Override
    protected HoldableResultResponse<Floor> pack(Object result) {
        return new HoldableResultResponse<>((Floor)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "New Floor added!"));
    }
    
}
