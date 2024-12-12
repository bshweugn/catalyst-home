package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.AddHouseRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.entity.HouseService;
import itmo.localpiper.backend.service.entity.LocationService;
import itmo.localpiper.backend.service.entity.UserHouseRelService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddHouseProcessor extends AbstractProcessor<Pair<String, AddHouseRequest>, OperationResultResponse>{

    @Autowired
    private LocationService locationService;

    @Autowired
    private HouseService houseService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserHouseRelService userHouseRelService;

    @Override
    protected Object send(Pair<String, AddHouseRequest> request) {
        String email = request.getFirst();
        String name = request.getSecond().getName();
        Double x = request.getSecond().getX();
        Double y = request.getSecond().getY();
        Long locationId = locationService.createOrReturn(x, y);
        House house = houseService.create(name, locationId);
        User user = userRepository.findByEmail(email).get();
        userHouseRelService.create(user.getId(), house.getId(), true);
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "New House added");
    }
    
}
