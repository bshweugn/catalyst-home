package itmo.localpiper.backend.service.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;

@Service
public class DeviceService {
    
    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;


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
        List<String> params = deviceTypeHandlerService.retrieveFeatures(number);
        if (params.contains("STATE")) {
            device.setStatus("OFF");
        }
        if (params.contains("RECHARGING")) {
            device.setBatteryLevel(100);
            device.setCharging(false);
        }
        device.setTriggerConditions(new ArrayList<>());
        deviceRepository.save(device);
    }
}
