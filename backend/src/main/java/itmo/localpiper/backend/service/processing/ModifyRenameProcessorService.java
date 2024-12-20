package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.EntityRenameRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.service.entity.CameraService;
import itmo.localpiper.backend.service.entity.DeviceService;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.service.entity.HouseService;
import itmo.localpiper.backend.service.entity.LocationService;
import itmo.localpiper.backend.service.entity.RoomService;
import itmo.localpiper.backend.service.entity.ScriptService;
import itmo.localpiper.backend.service.entity.TriggerConditionService;
import itmo.localpiper.backend.service.entity.UserService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;
import itmo.localpiper.backend.util.enums.Renamable;

@Service
public class ModifyRenameProcessorService extends AbstractProcessor<RequestPair<EntityRenameRequest>, OperationResultResponse>{

    @Autowired
    private UserService userService;
    
    @Autowired
    private LocationService locationService;

    @Autowired
    private HouseService houseService;

    @Autowired
    private FloorService floorService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private ScriptService scriptService;

    @Autowired
    private TriggerConditionService triggerConditionService;

    @Autowired
    private CameraService cameraService;

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private AccessValidationService accessValidationService;

    @Override
    protected Object send(RequestPair<EntityRenameRequest> request) {
        String email = request.getEmail();

        Long id = request.getBody().getId();
        String newName = request.getBody().getNewName();
        Renamable entity = request.getBody().getEntity();

        if (null != entity) switch (entity) {
            case CAMERA -> {
                Camera camera = cameraRepository.findById(id).get();
                accessValidationService.validateAccess(email, camera.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
            }
            case DEVICE -> {
                Device device = deviceRepository.findById(id).get();
                accessValidationService.validateAccess(email, device.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
            }
            case ROOM -> {
                Room room = roomRepository.findById(id).get();
                accessValidationService.validateAccess(email, room.getFloor().getHouse().getId(), AccessMode.STRICT);
            }
            case FLOOR -> {
                Floor floor = floorRepository.findById(id).get();
                accessValidationService.validateAccess(email, floor.getHouse().getId(), AccessMode.STRICT);
            }
            case HOUSE -> {
                House house = houseRepository.findById(id).get();
                accessValidationService.validateAccess(email, house.getId(), AccessMode.STRICT);
            }
            default -> {
            }
        }

        if (entity != null) {
            switch (entity) {
                case USER -> userService.rename(id, newName);
                case LOCATION -> locationService.rename(id, newName);
                case HOUSE -> houseService.rename(id, newName);
                case FLOOR -> floorService.rename(id, newName);
                case ROOM -> roomService.rename(id, newName);
                case SCRIPT -> scriptService.rename(id, newName);
                case TRIGGER -> triggerConditionService.rename(id, newName);
                case CAMERA -> cameraService.rename(id, newName);
                case DEVICE -> deviceService.rename(id, newName);
                default -> throw new IllegalArgumentException("Unsupported entity: " + entity);
            }
        }
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "idk what to write here");
    }
}