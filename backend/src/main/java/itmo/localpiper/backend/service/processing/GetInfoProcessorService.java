package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.EntityInfoRequest;
import itmo.localpiper.backend.dto.response.InfoResponse;
import itmo.localpiper.backend.repository.ActionRepository;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.LocationRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.repository.ScriptRepository;
import itmo.localpiper.backend.repository.TriggerConditionRepository;
import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.repository.VideoRecordingRepository;
import itmo.localpiper.backend.util.enums.EntityType;
import itmo.localpiper.backend.util.JsonUtils;

@Service
public class GetInfoProcessorService extends AbstractProcessor<EntityInfoRequest, InfoResponse>{

    @Autowired
    private ActionRepository actionRepository;

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private TriggerConditionRepository triggerConditionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDeviceActionRelRepository udarRepository;

    @Autowired
    private VideoRecordingRepository videoRecordingRepository;

    @Override
    protected Object send(EntityInfoRequest request) {
        EntityType type = request.getType();
        Long id = request.getId();
        if (null != type) switch (type) {
            case ACTION -> {
                return JsonUtils.toPrettyJson(actionRepository.findById(id).get());
            }
            case CAMERA -> {
                return JsonUtils.toPrettyJson(cameraRepository.findById(id).get());
            }
            case DEVICE -> {
                return JsonUtils.toPrettyJson(deviceRepository.findById(id).get());
            }
            case FLOOR -> {
                return JsonUtils.toPrettyJson(floorRepository.findById(id).get());
            }
            case HOUSE -> {
                return JsonUtils.toPrettyJson(houseRepository.findById(id).get());
            }
            case LOCATION -> {
                return JsonUtils.toPrettyJson(locationRepository.findById(id).get());
            }
            case ROOM -> {
                return JsonUtils.toPrettyJson(roomRepository.findById(id).get());
            }
            case SCRIPT -> {
                return JsonUtils.toPrettyJson(scriptRepository.findById(id).get());
            }
            case TRIGGER -> {
                return JsonUtils.toPrettyJson(triggerConditionRepository.findById(id).get());
            }
            case USER -> {
                return JsonUtils.toPrettyJson(userRepository.findById(id).get());
            }
            case UDAR -> {
                return JsonUtils.toPrettyJson(udarRepository.findById(id).get());
            }
            case VIDEO -> {
                return JsonUtils.toPrettyJson(videoRecordingRepository.findById(id).get());
            }
            default -> {
                throw new IllegalArgumentException("Unknown device type: " + type);
            }
        }
        return null;
    }

    @Override
    protected InfoResponse pack(Object result) {
        return new InfoResponse((String)result);
    }
    
}
