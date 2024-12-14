package itmo.localpiper.backend.service.transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserDeviceActionRel;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;
import itmo.localpiper.backend.service.entity.HouseService;
import itmo.localpiper.backend.service.entity.UserDeviceActionRelService;
import itmo.localpiper.backend.service.entity.UserHouseRelService;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import itmo.localpiper.backend.util.enums.HouseOwnership;

@Service
public class TransactionalEvictUserService {

    @Autowired
    private UserHouseRelService uhrService;

    @Autowired
    private UserDeviceActionRelRepository udarRepository;

    @Autowired
    private UserDeviceActionRelService udarService;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private HouseService houseService;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;
    
    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void leaveHouse(UserHouseRel uhr) {
        List<Device> devices = deviceRepository.findAllByHouseId(uhr.getHouse().getId());
        for (Device device : devices) {
            List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(uhr.getUser(), device);
            if (udars != null) {
                udarRepository.deleteAll(udars);
            }
        }
        uhrService.delete(uhr.getId());
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void leaveHouseWithReassignment(UserHouseRel uhr, User newOwner) {
        List<Device> devices = deviceRepository.findAllByHouseId(uhr.getHouse().getId());
        for (Device device : devices) {
            List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(uhr.getUser(), device);
            if (udars != null) {
                udarRepository.deleteAll(udars);
            }
        }
        House house = uhr.getHouse();
        uhrService.delete(uhr.getId());
        uhrService.create(newOwner.getId(), house.getId(), HouseOwnership.OWNER);
        for (Device device : devices) {
            List<String> actions = deviceTypeHandlerService.retrieveActionList(deviceTypeHandlerService.extractSerialNumber(device.getDeviceType()));
            for (String action : actions) {
                udarService.create(newOwner.getId(), device.getId(), action);
            }
        }
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void leaveHouseWithDeletion(Long houseId) {
        houseService.delete(houseId);
    }
}
