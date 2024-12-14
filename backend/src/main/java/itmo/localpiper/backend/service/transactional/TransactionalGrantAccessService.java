package itmo.localpiper.backend.service.transactional;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.entity.InvitationService;
import itmo.localpiper.backend.service.entity.UserDeviceActionRelService;
import itmo.localpiper.backend.service.entity.UserHouseRelService;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import itmo.localpiper.backend.util.enums.HouseOwnership;

@Service
public class TransactionalGrantAccessService {

    @Autowired
    private UserDeviceActionRelService udarService;

    @Autowired
    private DeviceRepository deviceRepository;
    
    @Autowired
    private UserHouseRelService uhrService;

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;
    

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void grantAccess(User user, House house, Map<Long, List<String>> privileges, Long inviteId) {
        for (Map.Entry<Long, List<String>> entry : privileges.entrySet()) {
            for (String action : entry.getValue()) {
                udarService.create(user.getId(), entry.getKey(), action);
            }   
        }
        uhrService.create(user.getId(), house.getId(), HouseOwnership.GUEST);

        invitationService.delete(inviteId);
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void grantFullAccess(User user, House house, Map<Long, List<String>> privileges, Long inviteId) {
        
        for (Map.Entry<Long, List<String>> entry : privileges.entrySet()) {
            Device device = deviceRepository.findById(entry.getKey()).get();
            List<String> actions = deviceTypeHandlerService.retrieveActionList(deviceTypeHandlerService.extractSerialNumber(device.getDeviceType()));
            for (String action : actions) {
                udarService.create(user.getId(), entry.getKey(), action);
            }
        }
        uhrService.create(user.getId(), house.getId(), HouseOwnership.RESIDENT);

        invitationService.delete(inviteId);
    }
}
