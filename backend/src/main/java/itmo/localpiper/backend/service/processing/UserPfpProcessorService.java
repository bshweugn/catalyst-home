package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.PfpRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class UserPfpProcessorService extends AbstractProcessor<Pair<String, PfpRequest>, HoldableResultResponse<User>> {

    @Autowired
    private UserRepository userRepository;

    @Override
    protected Object send(Pair<String, PfpRequest> request) {
        String email = request.getFirst();
        User user = userRepository.findByEmail(email).get();
        user.setProfilePicture(request.getSecond().getNewPfp());
        userRepository.save(user);
        return user;
    }

    @Override
    protected HoldableResultResponse<User> pack(Object result) {
        return new HoldableResultResponse<>((User)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "PFP updated"));
    }
    
}
