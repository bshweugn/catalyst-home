package itmo.localpiper.backend.service.processing;

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
import itmo.localpiper.backend.service.transactional.TransactionalGrantAccessService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class InvitationApplyProcessor extends AbstractProcessor<Pair<String, ProcessInvitationRequest>, OperationResultResponse>{

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionalGrantAccessService tgas;

    @Override
    protected Object send(Pair<String, ProcessInvitationRequest> request) {
        String email = request.getFirst();
        Long inviteId = request.getSecond().getInviteId();
        Boolean status = request.getSecond().getAccept();
        if (!status) {
            invitationService.delete(inviteId);
            return ProcessingStatus.ERROR;
        }
        Optional<Invitation> maybeInvitation = invitationService.findById(inviteId);
        if (maybeInvitation.isEmpty()) return ProcessingStatus.ERROR;
        
        Invitation invitation = maybeInvitation.get();
        User user = userRepository.findByEmail(email).get();
        Map<Long, List<String>> privileges;
        try {
            privileges = invitation.getPrivilegesAsMap();
        } catch (JsonProcessingException e) {
            return ProcessingStatus.ERROR;
        }
        tgas.grantAccess(user, invitation.getHouse(), privileges);
        return ProcessingStatus.SUCCESS;        
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse((ProcessingStatus)result, "idk what to write here");
    }
    
}
