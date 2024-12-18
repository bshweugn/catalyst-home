package itmo.localpiper.backend.service.processing.homeutils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalDeleteRecursiveEntityService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class DeleteRoomProcessorService extends AbstractProcessor<RequestPair<Long>, OperationResultResponse>{

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TransactionalDeleteRecursiveEntityService tdres;

    @Override
    protected Object send(RequestPair<Long> request) {
        String email = request.getEmail();
        Long roomId = request.getBody();

        Room room = roomRepository.findById(roomId).orElse(null);
        accessValidationService.validateAccess(email, room.getFloor().getHouse().getId(), AccessMode.STRICT);
        tdres.deleteRoom(room);
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "House deleted, users evicted");
    }
    
}