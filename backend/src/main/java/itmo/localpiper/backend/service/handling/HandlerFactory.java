package itmo.localpiper.backend.service.handling;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.entity.VideoRecordingService;
import itmo.localpiper.backend.service.handling.abstr.AbstractCameraHandler;
import itmo.localpiper.backend.service.handling.abstr.AbstractCurtainHandler;
import itmo.localpiper.backend.service.handling.abstr.AbstractFanHandler;
import itmo.localpiper.backend.service.handling.abstr.AbstractLampHandler;
import itmo.localpiper.backend.service.handling.concr.CameraHandler;
import itmo.localpiper.backend.service.handling.concr.CurtainHandler;
import itmo.localpiper.backend.service.handling.concr.FanHandler;
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

    private List<String> getCommands(Device device) {
        String serialNumber = deviceTypeHandlerService.extractSerialNumber(device.getDeviceType());
        List<String> commands = actionRegistry.get(serialNumber);
        if (commands == null) throw new IllegalArgumentException("Unknown device number: " + serialNumber);
        return commands;
    }

    public AbstractLampHandler getLampHandler(Device device) {
        return new LampHandler(getCommands(device), device, deviceRepository);
    }

    public AbstractCurtainHandler getCurtainHandler(Device device) {
        return new CurtainHandler(getCommands(device), device, deviceRepository);
    }

    public AbstractFanHandler getFanHandler(Device device) {
        return new FanHandler(getCommands(device), device, deviceRepository);
    }

    public AbstractCameraHandler getCameraHandler(Camera camera) {
        String serialNumber = deviceTypeHandlerService.extractSerialNumber(camera.getCameraType());
        List<String> commands = actionRegistry.get(serialNumber);
        if (commands == null) throw new IllegalArgumentException("Unknown device number: " + serialNumber);
        return new CameraHandler(commands, camera, videoRecordingService, cameraRepository);
    }


}
