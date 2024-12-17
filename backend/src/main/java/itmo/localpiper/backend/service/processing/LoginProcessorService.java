package itmo.localpiper.backend.service.processing;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.auth.LoginRequest;
import itmo.localpiper.backend.dto.auth.TokenResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.UserData;
import itmo.localpiper.backend.repository.UserDataRepository;
import itmo.localpiper.backend.util.JwtService;
import itmo.localpiper.backend.util.PasswordUtils;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class LoginProcessorService extends AbstractProcessor<LoginRequest, TokenResponse>{

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDataRepository userDataRepository;

    @Override
    protected Object send(LoginRequest request) {
        String login = request.getEmail();
        Optional<UserData> maybeUser = userDataRepository.findByLogin(login);
        if (maybeUser.isEmpty()) return null;
        if (!PasswordUtils.verifyPassword(request.getPassword(), maybeUser.get().getPassword())) return null;
        return jwtService.generateToken(login, 1000 * 60 * 60);
    }

    @Override
    protected TokenResponse pack(Object result) {
        if (result == null) {
            return new TokenResponse(null, new OperationResultResponse(ProcessingStatus.ERROR, "Invalid login/password"));
        }
        return new TokenResponse((String)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "Login successful"));
    }
    
}
