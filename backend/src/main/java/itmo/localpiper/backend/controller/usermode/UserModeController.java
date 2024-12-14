package itmo.localpiper.backend.controller.usermode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.user.PfpRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.service.processing.UserPfpProcessor;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user/")
public class UserModeController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserPfpProcessor userPfpProcessor;
    
    @PostMapping("/changePFP")
    public ResponseEntity<HoldableResultResponse<User>> changePFP(
        @Valid @RequestBody PfpRequest request,
        HttpServletRequest servletRequest
    ) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        Pair<String, PfpRequest> crutch = Pair.of(jwtService.extractEmail(token), request);
        return ResponseEntity.ok(userPfpProcessor.process(crutch));
    }
    
}
