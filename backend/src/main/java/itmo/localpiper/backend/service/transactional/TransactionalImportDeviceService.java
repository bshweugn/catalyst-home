package itmo.localpiper.backend.service.transactional;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.entity.UserCameraActionRelService;
import itmo.localpiper.backend.service.entity.UserDeviceActionRelService;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import itmo.localpiper.backend.util.FeatureDefinition;
import itmo.localpiper.backend.util.enums.DeviceType;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TransactionalImportDeviceService {
    
    private final UserDeviceActionRelService udarService;

    private final UserCameraActionRelService ucarService;

    private final DeviceRepository deviceRepository;

    private final CameraRepository cameraRepository;

    private final DeviceTypeHandlerService deviceTypeHandlerService;

    private final HashSet<String> states = new HashSet<>(Arrays.asList("ON_OFF_STATE", "CLOSEABLE_STATE", "RC_STATE", "LEAK_STATE", "CAMERA_STATE"));

    private Object determineDefaultValue(FeatureDefinition featureDefinition) {
        switch (featureDefinition.getType()) {
            case "ENUM" -> {
                return featureDefinition.getValues() != null && !featureDefinition.getValues().isEmpty()
                        ? featureDefinition.getValues().get(0)
                        : null;
            }
            case "NUMBER" -> {
                return featureDefinition.getMin();
            }
            case "STRING" -> {
                return "HEX".equals(featureDefinition.getFormat()) ? "#000000" : "";
            }
            case "BOOLEAN" -> {
                return false;
            }
            default -> throw new IllegalArgumentException("Unsupported feature type: " + featureDefinition.getType());
        }
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public Device importDevice(User user, String deviceName, String serialNumber, DeviceType deviceType, Room room) {
        List<String> actions = deviceTypeHandlerService.retrieveActionList(serialNumber);
        Map<String, FeatureDefinition> fm = deviceTypeHandlerService.retrieveFeaturesWithDefinitions(serialNumber);
        Device device = new Device();
        device.setName(deviceName);
        device.setRoom(room);
        device.setDeviceType(deviceTypeHandlerService.parseSerialNumber(serialNumber));
        Map<String, Object> features = new HashMap<>();
        for (Map.Entry<String, FeatureDefinition> entry : fm.entrySet()) {
            if (states.contains(entry.getKey())) {
                if ("ON_OFF_STATE".equals(entry.getKey()) || "RC_STATE".equals(entry.getKey()) || "LEAK_STATE".equals(entry.getKey())) {
                    device.setStatus("OFF");
                } else if ("CLOSEABLE_STATE".equals(entry.getKey())) {
                    device.setStatus("CLOSED");
                }
                continue;
            }
            if ("BATTERY".equals(entry.getKey())) {
                device.setBatteryLevel(100);
                device.setCharging(false);
                continue;
            }
            if ("BUFFER".equals(entry.getKey())) {
                features.put("BUFFER", 100);
                continue;
            }
            features.put(entry.getKey(), determineDefaultValue(entry.getValue()));
        }
        device.setFeatures(features);

        deviceRepository.save(device);
        for (String action : actions) {
            udarService.create(user.getId(), device.getId(), action);
        }
        return device;
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public Camera importCamera(User user, String cameraName, String serialNumber, Room room) {
        List<String> actions = deviceTypeHandlerService.retrieveActionList(serialNumber);
        Map<String, FeatureDefinition> fm = deviceTypeHandlerService.retrieveFeaturesWithDefinitions(serialNumber);
        Camera camera = new Camera();
        camera.setName(cameraName);
        camera.setRoom(room);
        camera.setCameraType(deviceTypeHandlerService.parseSerialNumber(serialNumber));
        camera.setMotionSensorEnabled(false);
        camera.setIsRecording(false);
        for (Map.Entry<String, FeatureDefinition> entry : fm.entrySet()) {
            if (states.contains(entry.getKey())) {
                camera.setStatus("OFF");
                continue;
            }
            if ("BATTERY".equals(entry.getKey())) {
                camera.setBatteryLevel(100);
                camera.setCharging(false);
                continue;
            }
            if ("ROTATION".equals(entry.getKey())) {
                camera.setXRotatePercent(50);
                camera.setYRotatePercent(50);
            }
        }
        cameraRepository.save(camera);
        for (String action : actions) {
            ucarService.create(user.getId(), camera.getId(), action);
        }
        return camera;
    }
}