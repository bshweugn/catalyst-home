package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.AddFloorRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddFloorProcessor extends AbstractProcessor<AddFloorRequest, OperationResultResponse>{

    @Autowired
    private FloorService floorService;

    @Override
    protected Object send(AddFloorRequest request) {
        String name = request.getName();
        Long houseId = request.getHouseId();
        floorService.create(name, houseId);
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "New Floor added!");
    }
    
}
