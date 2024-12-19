package itmo.localpiper.backend.service.processing.commands;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.DeviceCommandRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.HandlerFactory;
import itmo.localpiper.backend.service.handling.concr.CurtainHandler;
import itmo.localpiper.backend.service.handling.concr.FanHandler;
import itmo.localpiper.backend.service.handling.concr.LampHandler;
import itmo.localpiper.backend.service.handling.concr.LeakDetectorHandler;
import itmo.localpiper.backend.service.handling.concr.RelayHandler;
import itmo.localpiper.backend.service.handling.concr.TemperatureSensorHandler;
import itmo.localpiper.backend.service.handling.concr.ThermostatHandler;
import itmo.localpiper.backend.service.handling.concr.ValveHandler;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.DeviceTypeHandlerService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.DeviceType;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class DeviceCommandProcessorService extends AbstractProcessor<RequestPair<DeviceCommandRequest>, HoldableResultResponse<Device>>{

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private DeviceTypeHandlerService deviceTypeHandlerService;

    @Autowired
    private HandlerFactory handlerFactory;

    @Override
    protected Object send(RequestPair<DeviceCommandRequest> request) {
        String login = request.getEmail();
        String command = request.getBody().getCommand();
        Object arg = request.getBody().getArgument();
        Long deviceId = request.getBody().getDeviceId();

        Device device = deviceRepository.findById(deviceId).get();
        accessValidationService.validateAccess(login, device.getRoom().getFloor().getHouse().getId(), AccessMode.LIGHT);
        DeviceType type = deviceTypeHandlerService.extractDeviceType(device.getDeviceType());
        if (null != type) switch (type) {
            case LAMP -> {
                LampHandler lampHandler = (LampHandler)handlerFactory.getLampHandler(device);
                lampHandler.pickCommand(command, arg);
            }
            case RELAY -> {
                RelayHandler relayHandler = (RelayHandler)handlerFactory.getRelayHandler(device);
                relayHandler.pickCommand(command, arg);
            }
            case CURTAIN -> {
                CurtainHandler curtainHandler = (CurtainHandler)handlerFactory.getCurtainHandler(device);
                curtainHandler.pickCommand(command, arg);
            }
            case VALVE -> {
                ValveHandler valveHandler = (ValveHandler)handlerFactory.getValveHandler(device);
                valveHandler.pickCommand(command, arg);
            }
            case THERMOSTAT -> {
                ThermostatHandler thermostatHandler = (ThermostatHandler)handlerFactory.getThermostatHandler(device);
                thermostatHandler.pickCommand(command, arg);
            }
            case LEAK_DETECTOR -> {
                LeakDetectorHandler leakDetectorHandler = (LeakDetectorHandler)handlerFactory.getLeakDetectorHandler(device);
                leakDetectorHandler.pickCommand(command, arg);
            }
            case FAN -> {
                FanHandler fanHandler = (FanHandler)handlerFactory.getFanHandler(device);
                fanHandler.pickCommand(command, arg);
            }
            case TEMPERATURE_SENSOR -> {
                TemperatureSensorHandler temperatureSensorHandler = (TemperatureSensorHandler)handlerFactory.getTemperatureSensorHandler(device);
                temperatureSensorHandler.pickCommand(command, arg);
            }
            default -> {
            }
        }
        return deviceRepository.findById(deviceId).orElse(null);
    }

    @Override
    protected HoldableResultResponse<Device> pack(Object result) {
        return new HoldableResultResponse<>((Device)result, new OperationResultResponse(ProcessingStatus.SUCCESS, "Command executed"));
    }
    
}
