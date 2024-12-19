package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractTemperatureSensorHandler;
import itmo.localpiper.backend.service.handling.state.TemperatureSensorChargeManager;

public class TemperatureSensorHandler extends AbstractTemperatureSensorHandler {

    private final Device ts;
    private final DeviceRepository repository;
    private final TemperatureSensorChargeManager chargeManager = TemperatureSensorChargeManager.getInstance();

    public TemperatureSensorHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.ts = device;
        this.repository = deviceRepository;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "TURN_ON" -> turnOn();
            case "TURN_OFF" -> turnOff();
            case "CHARGE" -> charge();
            case "UNPLUG" -> unplug();
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        if (!"OFF".equals(ts.getStatus())) return;
        ts.setStatus("ON");
        repository.save(ts);
        chargeManager.registerTemperatureSensor(ts, repository);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(ts.getStatus())) return;
        ts.setStatus("OFF");
        repository.save(ts);
        chargeManager.deregisterTemperatureSensor(ts.getId());
    }

    @Override
    protected void charge() {
        checkCommand("CHARGE");
        if ("ON".equals(ts.getStatus())) {
            turnOff();
        }
        if (ts.getBatteryLevel() == 100) return; 
        ts.setCharging(true);
        repository.save(ts);

        chargeManager.registerTemperatureSensor(ts, repository);
    }

    @Override
    protected void unplug() {
        checkCommand("UNPLUG");
        ts.setCharging(false);
        repository.save(ts);

        chargeManager.deregisterTemperatureSensor(ts.getId());
    }
    
}
