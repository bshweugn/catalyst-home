package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.homeutils.AddRoomRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.RoomService;
import itmo.localpiper.backend.service.transactional.TransactionalCreateRecursiveEntityService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddRoomProcessorService extends AbstractProcessor<Pair<String,AddRoomRequest>, HoldableResultResponse<Room>>{

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionalCreateRecursiveEntityService tcres;

    @Override
    protected Object send(Pair<String,AddRoomRequest> request) {
        String email = request.getFirst();
        String name = request.getSecond().getName();
        Long floorId = request.getSecond().getFloorId();
        if (floorId == null) {
            User user = userRepository.findByEmail(email).get();
            return tcres.createRoom(user, name);
        }
        return roomService.create(name, floorId);
    }

    @Override
    protected HoldableResultResponse<Room> pack(Object result) {
        return new HoldableResultResponse<>((Room)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "New Room added"));
    }
    
}
