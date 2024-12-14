package itmo.localpiper.backend.service.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.RoomRepository;

@Service
public class DeviceService {
    
    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private RoomRepository roomRepository;
    
    public void rename(Long id, String newName) {
        Device device = deviceRepository.findById(id).get();
        device.setName(newName);
        deviceRepository.save(device);
    }

    public void move(Long deviceId, Long newRoomId) {
        Device device = deviceRepository.findById(deviceId).get();
        Room room = roomRepository.findById(newRoomId).get();
        device.setRoom(room);
        deviceRepository.save(device);
    }

    public List<Device> read() {
        return deviceRepository.findAll();
    }

    public void create(String name, Long roomId, String deviceType, String status, Integer batteryLevel, Boolean charging, Map<String, Object> features) {
        Device device = new Device();
        Room room = roomRepository.findById(roomId).get();
        device.setName(name);
        device.setRoom(room);
        device.setDeviceType(deviceType);
        device.setStatus(status);
        device.setBatteryLevel(batteryLevel);
        device.setCharging(charging);
        device.setFeatures(features);
        device.setTriggerConditions(new ArrayList<>());

        deviceRepository.save(device);
    }

    public void delete(Long id) {
        deviceRepository.deleteById(id);
    }


}
