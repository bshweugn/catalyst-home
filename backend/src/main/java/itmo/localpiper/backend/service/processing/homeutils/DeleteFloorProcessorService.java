package itmo.localpiper.backend.service.processing.homeutils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalDeleteRecursiveEntityService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class DeleteFloorProcessorService extends AbstractProcessor<RequestPair<Long>, OperationResultResponse>{

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private TransactionalDeleteRecursiveEntityService tdres;

    @Override
    protected Object send(RequestPair<Long> request) {
        String email = request.getEmail();
        Long floorId = request.getBody();

        Floor floor = floorRepository.findById(floorId).orElse(null);
        accessValidationService.validateAccess(email, floor.getHouse().getId(), AccessMode.STRICT);
        tdres.deleteFloor(floor);
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "House deleted, users evicted");
    }
    
}
