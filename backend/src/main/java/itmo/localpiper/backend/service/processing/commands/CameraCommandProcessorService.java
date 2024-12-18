package itmo.localpiper.backend.service.processing.commands;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.DeviceCommandRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.service.handling.HandlerFactory;
import itmo.localpiper.backend.service.handling.concr.CameraHandler;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class CameraCommandProcessorService extends AbstractProcessor<RequestPair<DeviceCommandRequest>, HoldableResultResponse<Camera>>{

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private HandlerFactory handlerFactory;

    @Override
    protected Object send(RequestPair<DeviceCommandRequest> request) {
        String email = request.getEmail();
        String command = request.getBody().getCommand();
        Object arg = request.getBody().getArgument();
        Long cameraId = request.getBody().getDeviceId();

        Camera camera = cameraRepository.findById(cameraId).orElse(null);
        accessValidationService.validateAccess(email, camera.getRoom().getFloor().getHouse().getId(), AccessMode.LIGHT);
        
        CameraHandler cameraHandler = (CameraHandler)handlerFactory.getCameraHandler(camera);
        cameraHandler.pickCommand(command, arg);
        return cameraRepository.findById(cameraId).orElse(null);
    }

    @Override
    protected HoldableResultResponse<Camera> pack(Object result) {
        return new HoldableResultResponse<>((Camera)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "Command executed"));
    }
    
}
