package itmo.localpiper.backend.service.processing;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.homeutils.AddRoomRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.RoleViolationException;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.RoomService;
import itmo.localpiper.backend.service.transactional.TransactionalCreateRecursiveEntityService;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddRoomProcessorService extends AbstractProcessor<Pair<String,AddRoomRequest>, HoldableResultResponse<Room>>{

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private UserHouseRelRepository uhrRepository;

    @Autowired
    private TransactionalCreateRecursiveEntityService tcres;


    @Override
    protected Object send(Pair<String,AddRoomRequest> request) {
        String email = request.getFirst();
        String name = request.getSecond().getName();
        Long floorId = request.getSecond().getFloorId();

        User user = userRepository.findByEmail(email).get();
        if (floorId == null) {
            return tcres.createRoom(user, name);
        }
        House house = floorRepository.findById(floorId).get().getHouse();
        Optional<UserHouseRel> maybeUhr = uhrRepository.findByUserAndHouse(user, house);
        if (maybeUhr.isEmpty() || maybeUhr.get().getRole() == HouseOwnership.GUEST) throw new RoleViolationException("Can't add room - permission denied");
        return roomService.create(name, floorId);
    }

    @Override
    protected HoldableResultResponse<Room> pack(Object result) {
        return new HoldableResultResponse<>((Room)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "New Room added"));
    }
    
}
