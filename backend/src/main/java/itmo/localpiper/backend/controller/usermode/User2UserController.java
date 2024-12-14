package itmo.localpiper.backend.controller.usermode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.user.InvitationRequest;
import itmo.localpiper.backend.dto.request.user.KickRequest;
import itmo.localpiper.backend.dto.request.user.LeaveRequest;
import itmo.localpiper.backend.dto.request.user.ProcessInvitationRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.invitations.EvictionProcessor;
import itmo.localpiper.backend.service.processing.invitations.InvitationApplyProcessor;
import itmo.localpiper.backend.service.processing.invitations.InvitationPersistProcessor;
import itmo.localpiper.backend.service.processing.invitations.LeaveProcessor;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/inviteManagement")
public class User2UserController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private InvitationPersistProcessor ipp;

    @Autowired
    private InvitationApplyProcessor iap;

    @Autowired
    private EvictionProcessor ep;

    @Autowired
    private LeaveProcessor lp;
    
    @PostMapping("/inviteUser")
    public ResponseEntity<OperationResultResponse> inviteUser(@Valid @RequestBody InvitationRequest request, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String username = jwtService.extractEmail(token);
        Pair<String, InvitationRequest> crutch = Pair.of(username, request);
        return ResponseEntity.ok(ipp.process(crutch));
    }

    @PostMapping("/processInvitation")
    public ResponseEntity<OperationResultResponse> processInvite(@Valid @RequestBody ProcessInvitationRequest request, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String username = jwtService.extractEmail(token);
        Pair<String, ProcessInvitationRequest> crutch = Pair.of(username, request);
        return ResponseEntity.ok(iap.process(crutch));
    }
    
    @PostMapping("/kickUser")
    public ResponseEntity<OperationResultResponse> kickUserFromHouse(@Valid @RequestBody KickRequest request, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String username = jwtService.extractEmail(token);
        Pair<String, KickRequest> crutch = Pair.of(username, request);
        return ResponseEntity.ok(ep.process(crutch));
    }

    @PostMapping("/leaveHouse")
    public ResponseEntity<OperationResultResponse> leaveHouse(@Valid @RequestBody LeaveRequest request, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String username = jwtService.extractEmail(token);
        Pair<String, LeaveRequest> crutch = Pair.of(username, request);
        return ResponseEntity.ok(lp.process(crutch));
    }
    
    
}
