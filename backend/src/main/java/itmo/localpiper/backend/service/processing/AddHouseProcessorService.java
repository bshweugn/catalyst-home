package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.homeutils.AddHouseRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.LocationRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.transactional.TransactionalCreateRecursiveEntityService;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddHouseProcessorService extends AbstractProcessor<Pair<String, AddHouseRequest>, HoldableResultResponse<House>>{

    @Autowired
    private TransactionalCreateRecursiveEntityService tcres;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Override
    protected Object send(Pair<String, AddHouseRequest> request) {
        String email = request.getFirst();
        String name = request.getSecond().getName();
        Double x = request.getSecond().getX();
        Double y = request.getSecond().getY();
        User user = userRepository.findByEmail(email).get();
        Long locationId = request.getSecond().getLocationId();
        if (locationId == null) {
            return tcres.createHouse(user, name, x, y);
        }
        Location location = locationRepository.findById(locationId).get();
        return tcres.createMappedHouse(user, name, location);
    }

    @Override
    protected HoldableResultResponse<House> pack(Object result) {
        return new HoldableResultResponse<>((House)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "New House added!"));
    }
    
}
