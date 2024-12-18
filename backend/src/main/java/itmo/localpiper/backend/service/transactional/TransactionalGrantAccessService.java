package itmo.localpiper.backend.service.transactional;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.entity.InvitationService;
import itmo.localpiper.backend.service.entity.UserCameraActionRelService;
import itmo.localpiper.backend.service.entity.UserDeviceActionRelService;
import itmo.localpiper.backend.service.entity.UserHouseRelService;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.Movable;

@Service
public class TransactionalGrantAccessService {

    @Autowired
    private UserDeviceActionRelService udarService;

    @Autowired
    private UserCameraActionRelService ucarService;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private CameraRepository cameraRepository;
    
    @Autowired
    private UserHouseRelService uhrService;

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;
    

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void grantAccess(User user, House house, Map<Pair<Long, Movable>, List<String>> privileges, Long inviteId) {
        for (Map.Entry<Pair<Long, Movable>, List<String>> entry : privileges.entrySet()) {
            for (String action : entry.getValue()) {
                if (entry.getKey().getSecond() == Movable.DEVICE) {
                    udarService.create(user.getId(), entry.getKey().getFirst(), action);
                } else if (entry.getKey().getSecond() == Movable.CAMERA) {
                    ucarService.create(user.getId(), entry.getKey().getFirst(), action);
                }
            }
        }
        uhrService.create(user.getId(), house.getId(), HouseOwnership.GUEST);

        invitationService.delete(inviteId);
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void grantFullAccess(User user, House house, Long inviteId) {
        List<Device> devices = deviceRepository.findAllByHouseId(house.getId()); // very slow
        for (Device device : devices) {
            List<String> actions = deviceTypeHandlerService.retrieveActionList(deviceTypeHandlerService.extractSerialNumber(device.getDeviceType()));
            for (String action : actions) {
                udarService.create(user.getId(), device.getId(), action);
            }
        }
        List<Camera> cameras = cameraRepository.findAllByHouseId(house.getId());
        for (Camera camera : cameras) {
            List<String> actions = deviceTypeHandlerService.retrieveActionList(deviceTypeHandlerService.extractSerialNumber(camera.getCameraType()));
            for (String action : actions) {
                ucarService.create(user.getId(), camera.getId(), action);
            }
        }
        uhrService.create(user.getId(), house.getId(), HouseOwnership.RESIDENT);

        invitationService.delete(inviteId);
    }
}
