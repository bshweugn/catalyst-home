package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractFanHandler;

public class FanHandler extends AbstractFanHandler {

    private final Device fan;
    private final DeviceRepository repository;

    public FanHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.fan = device;
        this.repository = deviceRepository;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "TURN_ON" -> turnOn();
            case "TURN_OFF" -> turnOff();
            case "CHANGE_SPEED" -> changeSpeed((int)arg);
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        fan.setStatus("ON");
        fan.getFeatures().put("SPEED", 100);
        repository.save(fan);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        fan.getFeatures().put("SPEED", 0);
        fan.setStatus("OFF");
        repository.save(fan);
    }

    @Override
    protected void changeSpeed(int speed) {
        checkCommand("CHANGE_SPEED");
        if (speed < 0 || speed > 100) {
            throw new IllegalArgumentException("Speed must be between 0 and 100");
        }
        if (!"OFF".equals(fan.getStatus())) {
            fan.getFeatures().put("SPEED", speed);
            repository.save(fan);
        }
    }
    
}
