package itmo.localpiper.backend.service.processing.invitations;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import itmo.localpiper.backend.dto.request.user.InvitationRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.InvitationService;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class InvitationPersistProcessor extends AbstractProcessor<Pair<String, InvitationRequest>, OperationResultResponse>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvitationService invitationService;

    @Override
    protected Object send(Pair<String, InvitationRequest> data) {
        String hostEmail = data.getFirst();
        String hostName = userRepository.findByEmail(hostEmail).get().getName();

        String questEmail = data.getSecond().getEmail();
        Long houseId = data.getSecond().getHouseId();
        Boolean isResident = data.getSecond().getIsResident();
        Map<Long, List<String>> actionMap = data.getSecond().getActionList();
        try {
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
