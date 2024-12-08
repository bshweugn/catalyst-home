package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.RoomRepository;

@Service
public class CameraService {
    
    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private RoomRepository roomRepository;

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
}
