package itmo.localpiper.backend.service.transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserCameraActionRel;
import itmo.localpiper.backend.model.UserDeviceActionRel;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.UserCameraActionRelRepository;
import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;
import itmo.localpiper.backend.util.enums.Movable;

@Service
public class TransactionalDeleteDeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private UserDeviceActionRelRepository udarRepository;

    @Autowired
    private UserCameraActionRelRepository ucarRepository;

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void deleteDevice(User user, Long id, Movable type) {
        if (type == Movable.DEVICE) {
            Device device = deviceRepository.findById(id).get();
            List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(user, device);
            for (UserDeviceActionRel udar : udars) udarRepository.delete(udar);
            deviceRepository.delete(device);
        } else {
            Camera camera = cameraRepository.findById(id).get();
            List<UserCameraActionRel> ucars = ucarRepository.findAllByUserAndCamera(user, camera);
            for (UserCameraActionRel ucar : ucars) ucarRepository.delete(ucar);
            cameraRepository.delete(camera);
        }
    }
}
