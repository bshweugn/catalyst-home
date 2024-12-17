package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserCameraActionRel;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.UserCameraActionRelRepository;
import itmo.localpiper.backend.repository.UserRepository;

@Service
public class UserCameraActionRelService {
    
    @Autowired
    private UserCameraActionRelRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CameraRepository cameraRepository;


    public List<UserCameraActionRel> read() {
        return repository.findAll();
    }

    public void create(Long userId, Long cameraId, String action) {
        UserCameraActionRel udar = new UserCameraActionRel();
        User user = userRepository.findById(userId).get();
        Camera camera = cameraRepository.findById(cameraId).get();
        udar.setUser(user);
        udar.setCamera(camera);
        udar.setAction(action);

        repository.save(udar);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
