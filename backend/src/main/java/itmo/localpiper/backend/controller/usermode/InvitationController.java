package itmo.localpiper.backend.controller.usermode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.user.InvitationRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.InvitationPersistProcessor;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/inviteManagement")
public class InvitationController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private InvitationPersistProcessor ipp;
    
    @PostMapping("/inviteUser")
    public ResponseEntity<OperationResultResponse> inviteUser(@Valid @RequestBody InvitationRequest request, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String username = jwtService.extractUsername(token);
        Pair<String, InvitationRequest> crutch = Pair.of(username, request);
        return ResponseEntity.ok(ipp.process(crutch));
    }
    
}
