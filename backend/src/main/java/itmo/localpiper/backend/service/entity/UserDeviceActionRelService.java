package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Action;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserDeviceActionRel;
import itmo.localpiper.backend.repository.ActionRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;
import itmo.localpiper.backend.repository.UserRepository;

@Service
public class UserDeviceActionRelService {
    
    @Autowired
    private UserDeviceActionRelRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private ActionRepository actionRepository;

    public List<UserDeviceActionRel> read() {
        return repository.findAll();
    }

    public void create(Long userId, Long deviceId, Long actionId) {
        UserDeviceActionRel udar = new UserDeviceActionRel();
        User user = userRepository.findById(userId).get();
        Device device = deviceRepository.findById(deviceId).get();
        Action action = actionRepository.findById(actionId).get();
        udar.setUser(user);
        udar.setDevice(device);
        udar.setAction(action);

        repository.save(udar);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
