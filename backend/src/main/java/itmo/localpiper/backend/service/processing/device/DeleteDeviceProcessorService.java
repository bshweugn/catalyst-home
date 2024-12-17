package itmo.localpiper.backend.service.processing.device;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.device.DeviceDeleteRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.RoleViolationException;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalDeleteDeviceService;
import itmo.localpiper.backend.util.enums.HouseOwnership;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class DeleteDeviceProcessorService extends AbstractProcessor<Pair<String, DeviceDeleteRequest>, OperationResultResponse>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserHouseRelRepository uhrRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private TransactionalDeleteDeviceService tdds;

    @Override
    protected Object send(Pair<String, DeviceDeleteRequest> request) {
        String email = request.getFirst();
        Long deviceId = request.getSecond().getDeviceId();
        Long houseId = request.getSecond().getHouseId();

        User user = userRepository.findByEmail(email).get();
        House house = houseRepository.findById(houseId).get();
        Optional<UserHouseRel> maybeUhr = uhrRepository.findByUserAndHouse(user, house);
        if (maybeUhr.isEmpty() || maybeUhr.get().getRole() == HouseOwnership.GUEST) throw new RoleViolationException("Can't delete device - permission denied");
        tdds.deleteDevice(user, deviceId, request.getSecond().getType());
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "Device deleted");
    }
    
}
