package itmo.localpiper.backend.service.processing.device;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.device.DeviceDeleteRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalDeleteDeviceService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class DeleteDeviceProcessorService extends AbstractProcessor<RequestPair<DeviceDeleteRequest>, OperationResultResponse>{

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private TransactionalDeleteDeviceService tdds;

    @Override
    protected Object send(RequestPair<DeviceDeleteRequest> request) {
        String email = request.getEmail();
        Long deviceId = request.getBody().getDeviceId();
        Long houseId = request.getBody().getHouseId();

        User user = accessValidationService.validateAccess(email, houseId, AccessMode.STRICT).getUser();
        tdds.deleteDevice(user, deviceId, request.getBody().getType());
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "Device deleted");
    }
    
}
