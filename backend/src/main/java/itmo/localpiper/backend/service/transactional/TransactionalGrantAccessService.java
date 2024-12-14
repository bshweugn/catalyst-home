package itmo.localpiper.backend.service.transactional;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.service.entity.InvitationService;
import itmo.localpiper.backend.service.entity.UserDeviceActionRelService;
import itmo.localpiper.backend.service.entity.UserHouseRelService;

@Service
public class TransactionalGrantAccessService {

    @Autowired
    private UserDeviceActionRelService udarService;
    
    @Autowired
    private UserHouseRelService uhrService;

    @Autowired
    private InvitationService invitationService;

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void grantAccess(User user, House house, Map<Long, List<String>> privileges, Long inviteId) {
        for (Map.Entry<Long, List<String>> entry : privileges.entrySet()) {
            for (String action : entry.getValue()) {
                udarService.create(user.getId(), entry.getKey(), action);
            }   
        }
        uhrService.create(user.getId(), house.getId(), false);

        invitationService.delete(inviteId);
    }
}
