package itmo.localpiper.backend.service.processing.invitations;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import itmo.localpiper.backend.dto.request.user.InvitationRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.RoleViolationException;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.InvitationService;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.Movable;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class InvitationPersistProcessorService extends AbstractProcessor<RequestPair<InvitationRequest>, OperationResultResponse>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private AccessValidationService accessValidationService;

    @Override
    protected Object send(RequestPair<InvitationRequest> data) {
        String hostEmail = data.getEmail();
        String hostName = userRepository.findByEmail(hostEmail).get().getName();

        String questEmail = data.getBody().getEmail();
        Long houseId = data.getBody().getHouseId();
        Boolean isResident = data.getBody().getIsResident();
        Map<Pair<Long, Movable>, List<String>> actionMap = data.getBody().getActionList();
        
        UserHouseRel uhr = accessValidationService.validateAccess(hostEmail, houseId, AccessMode.STRICT);
        try {
            HouseOwnership role = uhr.getRole();
            if (role == HouseOwnership.RESIDENT && isResident) {
                throw new RoleViolationException("Can't assign role - permission denied!");
            }
            invitationService.create(hostName, questEmail, houseId, isResident, actionMap);
        } catch (JsonProcessingException e) {
            return ProcessingStatus.ERROR;
        }
        return ProcessingStatus.SUCCESS;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        ProcessingStatus status = (ProcessingStatus)result;
        if (status == ProcessingStatus.ERROR) {
            return new OperationResultResponse(ProcessingStatus.ERROR, "User was not invited");
        }
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "User was invited");
    }
    
}
