package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.auth.RegisterRequest;
import itmo.localpiper.backend.dto.auth.TokenResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.NonUniqueValueException;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserData;
import itmo.localpiper.backend.repository.UserDataRepository;
import itmo.localpiper.backend.service.entity.UserService;
import itmo.localpiper.backend.service.transactional.TransactionalCreateRecursiveEntityService;
import itmo.localpiper.backend.util.JwtService;
import itmo.localpiper.backend.util.PasswordUtils;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class RegisterProcessorService extends AbstractProcessor<RegisterRequest, TokenResponse>{

    @Autowired
    private UserService userService;

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TransactionalCreateRecursiveEntityService tcres;

    @Override
    protected Object send(RegisterRequest request) {
        String name = request.getUsername();
        String email = request.getEmail();
        String password = PasswordUtils.hashPassword(request.getPassword());
        try {
            User user = userService.create(name, email, null);
            UserData userData = new UserData();
            userData.setLogin(email);
            userData.setPassword(password);
            userData.setUser(user);
            userDataRepository.save(userData);
            tcres.createRoom(user, "My Room");
        } catch (NonUniqueValueException e) {
            return null;
        }
        return jwtService.generateToken(email, 1000 * 60 * 60);
        
    }

    @Override
    protected TokenResponse pack(Object result) {
        if (result == null) {
            return new TokenResponse(null, new OperationResultResponse(ProcessingStatus.ERROR, "User with given email already exists"));
        }
        return new TokenResponse((String)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "Login successful"));
    }
    
}
