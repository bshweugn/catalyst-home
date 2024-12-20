package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.EntityMoveRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.service.entity.CameraService;
import itmo.localpiper.backend.service.entity.DeviceService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.Movable;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class ModifyMoveProcessorService extends AbstractProcessor<RequestPair<EntityMoveRequest>, OperationResultResponse> {

    @Autowired
    private CameraService cameraService;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private AccessValidationService accessValidationService;

    @Override
    protected Object send(RequestPair<EntityMoveRequest> request) {
        String email = request.getEmail();
        Long id = request.getBody().getId();
        Long toRoom = request.getBody().getToId();

        Room room = roomRepository.findById(toRoom).get();
        accessValidationService.validateAccess(email, room.getFloor().getHouse().getId(), AccessMode.STRICT);

        Movable entity = request.getBody().getEntity();
        if (null == entity) {
            throw new IllegalArgumentException("Unsupported entity: " + entity);
        } else switch (entity) {
            case CAMERA -> {
                Camera camera = cameraRepository.findById(id).get();
                accessValidationService.validateAccess(email, camera.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
                cameraService.move(camera.getId(), toRoom);
            }
            case DEVICE -> {
                Device device = deviceRepository.findById(id).get();
                accessValidationService.validateAccess(email, device.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
                deviceService.move(device.getId(), toRoom);
            }
            default -> throw new IllegalArgumentException("Unsupported entity: " + entity);
        }
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "idk what to write here");
    }
    
}
