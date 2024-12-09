package itmo.localpiper.backend.service.processing;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import itmo.localpiper.backend.dto.request.ImportCreateRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.entity.CameraService;
import itmo.localpiper.backend.service.entity.DeviceService;
import itmo.localpiper.backend.util.enums.DeviceType;
import itmo.localpiper.backend.util.enums.ProcessingStatus;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ImportCreateProcessorService extends AbstractProcessor<ImportCreateRequest, OperationResultResponse>{

    private final Map<String, JsonNode> deviceRegistry;

    private final CameraService cameraService;

    private final DeviceService deviceService;

    @Override
    protected Object send(ImportCreateRequest request) {
        String serialNumber = request.getSerialNumber();
        String deviceName = request.getName();
        Long roomId = request.getRoomId();
        JsonNode device = deviceRegistry.get(serialNumber);
        DeviceType deviceType = DeviceType.valueOf(device.get("type").asText());            
        if (deviceType == DeviceType.CAMERA) {
            cameraService.addNew(serialNumber, deviceName, roomId);
        } else {
            deviceService.addNew(serialNumber, deviceName, roomId);
        }

        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "Device added successfully");
    }
    
}
