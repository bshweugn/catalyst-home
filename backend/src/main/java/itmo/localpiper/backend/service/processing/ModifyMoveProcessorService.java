package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.EntityMoveRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.entity.CameraService;
import itmo.localpiper.backend.service.entity.DeviceService;
import itmo.localpiper.backend.util.Movable;
import itmo.localpiper.backend.util.ProcessingStatus;

@Service
public class ModifyMoveProcessorService extends AbstractProcessor<EntityMoveRequest, OperationResultResponse>{

    @Autowired
    private CameraService cameraService;

    @Autowired
    private DeviceService deviceService;

    @Override
    protected Object send(EntityMoveRequest request) {
        Long id = request.getId();
        Long toRoom = request.getToId();
        Movable entity = request.getEntity();
        if (null == entity) {
            throw new IllegalArgumentException("Unsupported entity: " + entity);
        } else switch (entity) {
            case CAMERA -> cameraService.move(id, toRoom);
            case DEVICE -> deviceService.move(id, toRoom);
            default -> throw new IllegalArgumentException("Unsupported entity: " + entity);
        }
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "idk what to write here");
    }
    
}
