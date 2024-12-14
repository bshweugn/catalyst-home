package itmo.localpiper.backend.service.transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.UserDeviceActionRel;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;
import itmo.localpiper.backend.service.entity.UserHouseRelService;

@Service
public class TransactionalEvictUserService {

    @Autowired
    private UserHouseRelService uhrService;

    @Autowired
    private UserDeviceActionRelRepository udarRepository;

    @Autowired
    private DeviceRepository deviceRepository;
    
    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void evictUser(UserHouseRel uhr) {
        List<Device> devices = deviceRepository.findAllByHouseId(uhr.getHouse().getId());
        for (Device device : devices) {
            List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(uhr.getUser(), device);
            if (udars != null) {
                udarRepository.deleteAll(udars);
            }
        }
        uhrService.delete(uhr.getId());
    }
}
