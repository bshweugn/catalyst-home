package itmo.localpiper.backend.controller.usermode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.user.DeviceCommandRequest;
import itmo.localpiper.backend.dto.request.user.PfpRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.service.processing.UserPfpProcessorService;
import itmo.localpiper.backend.service.processing.commands.DeviceCommandProcessorService;
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user/")
public class UserModeController {

    @Autowired
    private RequestTransformer requestTransformer;

    @Autowired
    private UserPfpProcessorService userPfpProcessorService;

    @Autowired
    private DeviceCommandProcessorService deviceCommandProcessorService;
    
    @PostMapping("/changePFP")
    public ResponseEntity<HoldableResultResponse<User>> changePFP(
        @Valid @RequestBody PfpRequest request,
        HttpServletRequest servletRequest
    ) {
        return ResponseEntity.ok(userPfpProcessorService.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }

    @PostMapping("/executeDeviceCommand")
    public ResponseEntity<HoldableResultResponse<Device>> executeDeviceCommand(@Valid @RequestBody DeviceCommandRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(deviceCommandProcessorService.process(requestTransformer.transform(request, servletRequest)));
    }

    @PostMapping("/executeCameraCommand")
    public String executeCameraCommand(@Valid @RequestBody DeviceCommandRequest request, HttpServletRequest servletRequest) {
        return null;
    }
    
    
    
}
