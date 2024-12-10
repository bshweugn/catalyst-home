package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.AddHouseRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.entity.HouseService;
import itmo.localpiper.backend.service.entity.LocationService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddHouseProcessor extends AbstractProcessor<AddHouseRequest, OperationResultResponse>{

    @Autowired
    private LocationService locationService;

    @Autowired
    private HouseService houseService;

    @Override
    protected Object send(AddHouseRequest request) {
        String name = request.getName();
        Double x = request.getX();
        Double y = request.getY();
        Long locationId = locationService.createOrReturn(x, y);
        houseService.create(name, locationId);
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "New House added");
    }
    
}
