package itmo.localpiper.backend.service.processing.commands;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.DeviceCommandRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.exceptions.CommandNotAllowedException;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserDeviceActionRel;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;

@Service
public class DeviceCommandProcessorService extends AbstractProcessor<Pair<String, DeviceCommandRequest>, OperationResultResponse>{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserDeviceActionRelRepository udarRepository;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;

    private boolean checkAllowed(List<UserDeviceActionRel> udars, String command) {
        boolean b = false;
        for (UserDeviceActionRel udar : udars) {
            if (udar.getAction().equals(command)) {
                b = true;
                break;
            }
        }
        return b;
    }

    @Override
    protected Object send(Pair<String, DeviceCommandRequest> request) {
        String login = request.getFirst();
        String command = request.getSecond().getCommand();
        Object arg = request.getSecond().getArgument();
        Long deviceId = request.getSecond().getDeviceId();

        User user = userRepository.findByEmail(login).get();
        Device device = deviceRepository.findById(deviceId).get();

        // step 1 : check if command exists
        List<String> actionList = deviceTypeHandlerService.retrieveActionList(deviceTypeHandlerService.extractSerialNumber(device.getDeviceType()));
        if (!actionList.contains(command)) throw new CommandNotAllowedException("Command cannot be executed on this device!");

        // step 2 : check if command allowed
        List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(user, device);
        if (!checkAllowed(udars, command)) throw new CommandNotAllowedException("Command is not allowed to be executed on this device!");

        // step 3 : call handler of given command
        throw new UnsupportedOperationException("Unimplemented method 'send'");
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'pack'");
    }
    
}
