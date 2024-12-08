package itmo.localpiper.backend.service.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;

@Service
public class CameraService {
    
    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;

    public void changeStatus(Long id, String newStatus) {
        Camera camera = cameraRepository.findById(id).get();
        camera.setStatus(newStatus);
        camera.setIsRecording(true);
        cameraRepository.save(camera);
    }

    public void move(Long cameraId, Long newRoomId) {
        Camera camera = cameraRepository.findById(cameraId).get();
        Room room = roomRepository.findById(newRoomId).get();
        camera.setRoom(room);
        cameraRepository.save(camera);
    }

    public void addNew(String number, String name, Long roomId) {
        Camera camera = new Camera();
        Room room = roomRepository.findById(roomId).get();
        camera.setName(name);
        camera.setRoom(room);
        String deviceType = deviceTypeHandlerService.parseSerialNumber(number);
        camera.setCamera_type(deviceType);
        List<String> params = deviceTypeHandlerService.retrieveFeatures(number);
        
        if (params.contains("STATE")) {
            camera.setStatus("OFF");
        }
        if (params.contains("RECORDING")) {
            camera.setIsRecording(false);
        }
        if (params.contains("MOTION_SENSOR")) {
            camera.setMotionSensorEnabled(false);
        }
        if (params.contains("RECHARGING")) {
            camera.setBatteryLevel(100);
            camera.setCharging(false);
        }
        if (params.contains("ROTATION")) {
            camera.setXRotatePercent(50);
            camera.setYRotatePercent(50);
        }
        camera.setTriggerConditions(new ArrayList<>());
        cameraRepository.save(camera);
    }
}
