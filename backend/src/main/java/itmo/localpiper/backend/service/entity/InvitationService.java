package itmo.localpiper.backend.service.entity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Invitation;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.InvitationRepository;

@Service
public class InvitationService {
    
    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private HouseRepository houseRepository;

    public List<Invitation> read() {
        return invitationRepository.findAll();
    }


    public void create(String hostName, String guestEmail, Long houseId, Boolean isResident, Map<Long, List<String>> actionMap) throws JsonProcessingException {
        Invitation invitation = new Invitation();
        House house = houseRepository.findById(houseId).get();
        invitation.setHostName(hostName);
        invitation.setGuestEmail(guestEmail);
        invitation.setHouse(house);
        invitation.setIsResident(isResident);
        invitation.setPrivilegesFromMap(actionMap);
        
        invitationRepository.save(invitation);
    }

    public void delete(Long id) {
        invitationRepository.deleteById(id);
    }

    public Optional<Invitation> findById(Long id) {
        return invitationRepository.findById(id);
    }
}
