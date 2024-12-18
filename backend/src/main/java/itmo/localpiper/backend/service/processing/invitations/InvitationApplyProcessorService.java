package itmo.localpiper.backend.service.processing.invitations;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import itmo.localpiper.backend.dto.request.user.ProcessInvitationRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Invitation;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.InvitationService;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalGrantAccessService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.Movable;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class InvitationApplyProcessorService extends AbstractProcessor<RequestPair<ProcessInvitationRequest>, OperationResultResponse>{

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionalGrantAccessService tgas;

    @Override
    protected Object send(RequestPair<ProcessInvitationRequest> request) {
        String email = request.getEmail();
        Long inviteId = request.getBody().getInviteId();
        Boolean status = request.getBody().getAccept();
        if (!status) {
            invitationService.delete(inviteId);
            return ProcessingStatus.ERROR;
        }
        Optional<Invitation> maybeInvitation = invitationService.findById(inviteId);
        if (maybeInvitation.isEmpty()) return ProcessingStatus.ERROR;
        
        Invitation invitation = maybeInvitation.get();
        User user = userRepository.findByEmail(email).get();
        Map<Pair<Long, Movable>, List<String>> privileges;
        try {
            privileges = invitation.getPrivilegesAsMap();
        } catch (JsonProcessingException e) {
            return ProcessingStatus.ERROR;
        }
        if (invitation.getIsResident()) {
            tgas.grantFullAccess(user, invitation.getHouse(), inviteId);
        } else {
            tgas.grantAccess(user, invitation.getHouse(), privileges, inviteId);
        }
        return ProcessingStatus.SUCCESS;        
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse((ProcessingStatus)result, "Invitation processed");
    }
    
}
