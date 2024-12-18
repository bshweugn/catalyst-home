package itmo.localpiper.backend.service.processing.homeutils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalDeleteRecursiveEntityService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class DeleteHouseProcessorService extends AbstractProcessor<RequestPair<Long>, OperationResultResponse>{

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private TransactionalDeleteRecursiveEntityService tdres;

    @Override
    protected Object send(RequestPair<Long> request) {
        String email = request.getEmail();
        Long houseId = request.getBody();
        UserHouseRel uhr = accessValidationService.validateAccess(email, houseId, AccessMode.STRICT);
        tdres.deleteHouse(uhr.getHouse());
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "House deleted, users evicted");
    }
    
}
