package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;

@Service
public class CameraService {
    
    @Autowired
    private CameraRepository repository;

    public void changeStatus(Long id, String newStatus) {
        Camera camera = repository.findById(id).get();
        camera.setStatus(newStatus);
        camera.setIsRecording(true);
        repository.save(camera);
    }
}
