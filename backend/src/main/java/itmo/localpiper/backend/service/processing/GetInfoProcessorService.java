package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
                return actionRepository.findById(id).get().toJson();
            }
            case CAMERA -> {
                return cameraRepository.findById(id).get().toJson();
            }
            case DEVICE -> {
                return deviceRepository.findById(id).get().toJson();
            }
            case FLOOR -> {
                return floorRepository.findById(id).get().toJson();
            }
            case HOUSE -> {
                return houseRepository.findById(id).get().toJson();
            }
            case LOCATION -> {
                return locationRepository.findById(id).get().toJson();
            }
            case ROOM -> {
                return roomRepository.findById(id).get().toJson();
            }
            case SCRIPT -> {
                return scriptRepository.findById(id).get().toJson();
            }
            case TRIGGER -> {
                return triggerConditionRepository.findById(id).get().toJson();
            }
            case USER -> {
                return userRepository.findById(id).get().toJson();
            }
            case UDAR -> {
                return udarRepository.findById(id).get().toJson();
            }
            case VIDEO -> {
                return videoRecordingRepository.findById(id).get().toJson();
            }
            default -> {
                throw new IllegalArgumentException("Unknown device type: " + type);
            }
        }
        return null;
    }

    @Override
    protected InfoResponse pack(Object result) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        Object json = mapper.readValue((String) result, Object.class);
        String prettyJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);
        return new InfoResponse(prettyJson);
    } catch (JsonProcessingException e) {
        throw new RuntimeException("Error prettifying JSON", e);
    }
    }
    
}
