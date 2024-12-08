package itmo.localpiper.backend.service.entity;

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

    public void move(Long deviceId, Long newRoomId) {
        Device device = deviceRepository.findById(deviceId).get();
        Room room = roomRepository.findById(newRoomId).get();
        device.setRoom(room);
        deviceRepository.save(device);
    }
}
