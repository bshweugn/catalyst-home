package itmo.localpiper.backend.service.processing.device;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import itmo.localpiper.backend.dto.request.device.ImportCreateRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.RoleViolationException;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalImportDeviceService;
import itmo.localpiper.backend.util.enums.DeviceType;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.ProcessingStatus;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ImportCreateProcessorService extends AbstractProcessor<Pair<String, ImportCreateRequest>, HoldableResultResponse<?>>{

    private final Map<String, JsonNode> deviceRegistry;

    private final UserRepository userRepository;

    private final RoomRepository roomRepository;

    private final UserHouseRelRepository uhrRepository;

    private final TransactionalImportDeviceService tids;

    @Override
    protected Object send(Pair<String, ImportCreateRequest> request) {
        String email = request.getFirst();
        String serialNumber = request.getSecond().getSerialNumber();
        String deviceName = request.getSecond().getName();
        Long roomId = request.getSecond().getRoomId();

        User user = userRepository.findByEmail(email).get();
        Room room = roomRepository.findById(roomId).get();
        House house = room.getFloor().getHouse();
        Optional<UserHouseRel> maybeUhr = uhrRepository.findByUserAndHouse(user, house);
        if (maybeUhr.isEmpty() || maybeUhr.get().getRole() == HouseOwnership.GUEST) throw new RoleViolationException("Can't import device - access denied");
        JsonNode device = deviceRegistry.get(serialNumber);
        DeviceType deviceType = DeviceType.valueOf(device.get("type").asText());            
        if (deviceType == DeviceType.CAMERA) {
            return tids.importCamera(user, deviceName, serialNumber, room);
        }
        return tids.importDevice(user, deviceName, serialNumber, deviceType, room);
    }

    @Override
    protected HoldableResultResponse<?> pack(Object result) {
        return new HoldableResultResponse<>(result, new OperationResultResponse(ProcessingStatus.SUCCESS, "Device added successfully"));
    }
    
}
