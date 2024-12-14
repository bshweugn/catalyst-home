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

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.entity.UserDeviceActionRelService;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import itmo.localpiper.backend.util.FeatureDefinition;
import itmo.localpiper.backend.util.enums.DeviceType;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TransactionalImportDeviceService {
    
    private final UserDeviceActionRelService udarService;

    private final DeviceRepository deviceRepository;

    private final DeviceTypeHandlerService deviceTypeHandlerService;

    private final HashSet<String> states = new HashSet<>(Arrays.asList("ON_OFF_STATE", "CLOSEABLE_STATE", "RC_STATE"));

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
                if ("ON_OFF_STATE".equals(entry.getKey()) || "RC_STATE".equals(entry.getKey())) {
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
            features.put(entry.getKey(), determineDefaultValue(entry.getValue()));
        }
        device.setFeatures(features);

        deviceRepository.save(device);
        for (String action : actions) {
            udarService.create(user.getId(), device.getId(), action);
        }
        return device;
    }
}