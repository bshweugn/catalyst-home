package itmo.localpiper.backend.service.handling;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.entity.VideoRecordingService;
import itmo.localpiper.backend.service.handling.abstr.AbstractCameraHanlder;
import itmo.localpiper.backend.service.handling.abstr.AbstractLampHandler;
import itmo.localpiper.backend.service.handling.concr.CameraHandler;
import itmo.localpiper.backend.service.handling.concr.LampHandler;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class HandlerFactory {

    private final Map<String, List<String>> actionRegistry;
    private final DeviceRepository deviceRepository;
    private final CameraRepository cameraRepository;
    private final VideoRecordingService videoRecordingService;
    private final DeviceTypeHandlerService deviceTypeHandlerService;

    public AbstractLampHandler getLampHandler(Device device) {
        String serialNumber = deviceTypeHandlerService.extractSerialNumber(device.getDeviceType());
        List<String> commands = actionRegistry.get(serialNumber);
        if (commands == null) throw new IllegalArgumentException("Unknown device number: " + serialNumber);
        return new LampHandler(commands, device, deviceRepository);
    }

    public AbstractCameraHanlder getCameraHandler(Camera camera) {
        String serialNumber = deviceTypeHandlerService.extractSerialNumber(camera.getCameraType());
        List<String> commands = actionRegistry.get(serialNumber);
        if (commands == null) throw new IllegalArgumentException("Unknown device number: " + serialNumber);
        return new CameraHandler(commands, camera, videoRecordingService, cameraRepository);
    }
}
