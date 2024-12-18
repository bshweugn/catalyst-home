package itmo.localpiper.backend.service.processing.device;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import itmo.localpiper.backend.dto.request.device.ImportCreateRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalImportDeviceService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.DeviceType;
import itmo.localpiper.backend.util.enums.ProcessingStatus;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ImportCreateProcessorService extends AbstractProcessor<RequestPair<ImportCreateRequest>, HoldableResultResponse<?>>{

    private final Map<String, JsonNode> deviceRegistry;

    private final RoomRepository roomRepository;

    private final AccessValidationService accessValidationService;

    private final TransactionalImportDeviceService tids;

    @Override
    protected Object send(RequestPair<ImportCreateRequest> request) {
        String email = request.getEmail();
        String serialNumber = request.getBody().getSerialNumber();
        String deviceName = request.getBody().getName();
        Long roomId = request.getBody().getRoomId();

        Room room = roomRepository.findById(roomId).get();
        User user = accessValidationService.validateAccess(email, room.getFloor().getHouse().getId(), AccessMode.STRICT).getUser();
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
