package itmo.localpiper.backend.controller.usermode;

import org.springframework.beans.factory.annotation.Autowired;
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
import itmo.localpiper.backend.service.processing.invitations.EvictionProcessorService;
import itmo.localpiper.backend.service.processing.invitations.InvitationApplyProcessorService;
import itmo.localpiper.backend.service.processing.invitations.InvitationPersistProcessorService;
import itmo.localpiper.backend.service.processing.invitations.LeaveProcessorService;
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/inviteManagement")
public class User2UserController {

    @Autowired
    private RequestTransformer requestTransformer;

    @Autowired
    private InvitationPersistProcessorService ipp;

    @Autowired
    private InvitationApplyProcessorService iap;

    @Autowired
    private EvictionProcessorService ep;

    @Autowired
    private LeaveProcessorService lp;
    
    @PostMapping("/inviteUser")
    public ResponseEntity<OperationResultResponse> inviteUser(@Valid @RequestBody InvitationRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(ipp.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }

    @PostMapping("/processInvitation")
    public ResponseEntity<OperationResultResponse> processInvite(@Valid @RequestBody ProcessInvitationRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(iap.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }
    
    @PostMapping("/kickUser")
    public ResponseEntity<OperationResultResponse> kickUserFromHouse(@Valid @RequestBody KickRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(ep.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }

    @PostMapping("/leaveHouse")
    public ResponseEntity<OperationResultResponse> leaveHouse(@Valid @RequestBody LeaveRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(lp.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }
    
    
}
