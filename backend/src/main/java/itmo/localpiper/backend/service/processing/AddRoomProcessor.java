package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.AddRoomRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.entity.RoomService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddRoomProcessor extends AbstractProcessor<AddRoomRequest, OperationResultResponse>{

    @Autowired
    private RoomService roomService;

    @Override
    protected Object send(AddRoomRequest request) {
        String name = request.getName();
        Long floorId = request.getFloorId();
        roomService.create(name, floorId);
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "New Room added");
    }
    
}
