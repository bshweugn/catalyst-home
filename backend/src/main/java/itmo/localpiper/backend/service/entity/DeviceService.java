package itmo.localpiper.backend.service.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import itmo.localpiper.backend.util.FeatureDefinition;

@Service
public class DeviceService {
    
    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;

    private Object determineDefaultValue(FeatureDefinition featureDefinition) {
        switch (featureDefinition.getType()) {
            case "ENUM" -> {
                return featureDefinition.getValues() != null && !featureDefinition.getValues().isEmpty()
                        ? featureDefinition.getValues().get(0)
                        : null;
            }
            case "NUMBER" -> {
                return featureDefinition.getMin() != null ? featureDefinition.getMin() : 0;
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
    

    public void move(Long deviceId, Long newRoomId) {
        Device device = deviceRepository.findById(deviceId).get();
        Room room = roomRepository.findById(newRoomId).get();
        device.setRoom(room);
        deviceRepository.save(device);
    }

    public void addNew(String number, String name, Long roomId) {
        Device device = new Device();
        Room room = roomRepository.findById(roomId).get();
        device.setName(name);
        device.setRoom(room);
        String deviceType = deviceTypeHandlerService.parseSerialNumber(number);
        device.setDeviceType(deviceType);
        Map<String, FeatureDefinition> fdfs = deviceTypeHandlerService.retrieveFeaturesWithDefinitions(number);
        
        Map<String, Object> features = new HashMap<>();
        for (Map.Entry<String, FeatureDefinition> entry : fdfs.entrySet()) {
            String featureKey = entry.getKey();
            FeatureDefinition featureDefinition = entry.getValue();
            Object defaultValue = determineDefaultValue(featureDefinition);
            features.put(featureKey, defaultValue);
        }
        device.setFeatures(features);

        device.setTriggerConditions(new ArrayList<>());
        deviceRepository.save(device);
    }

    public void delete(Long id) {
        deviceRepository.deleteById(id);
    }
}
