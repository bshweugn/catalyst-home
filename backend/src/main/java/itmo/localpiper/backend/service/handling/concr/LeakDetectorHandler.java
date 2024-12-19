package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractLeakDetectorHandler;
import itmo.localpiper.backend.service.handling.state.LeakDetectorChargeManager;

public class LeakDetectorHandler extends AbstractLeakDetectorHandler {

    private final Device ld;
    private final DeviceRepository repository;
    private final LeakDetectorChargeManager chargeManager = LeakDetectorChargeManager.getInstance();

    public LeakDetectorHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.ld = device;
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
        if (!"OFF".equals(ld.getStatus())) return;
        ld.setStatus("ON");
        repository.save(ld);
        chargeManager.registerLeakDetector(ld, repository);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(ld.getStatus())) return;
        ld.setStatus("OFF");
        repository.save(ld);
        chargeManager.deregisterLeakDetector(ld.getId());
    }

    @Override
    protected void charge() {
        checkCommand("CHARGE");
        if ("ON".equals(ld.getStatus())) {
            turnOff();
        }
        if (ld.getBatteryLevel() == 100) return; 
        ld.setCharging(true);
        repository.save(ld);

        chargeManager.registerLeakDetector(ld, repository);
    }

    @Override
    protected void unplug() {
        checkCommand("UNPLUG");
        ld.setCharging(false);
        repository.save(ld);

        chargeManager.deregisterLeakDetector(ld.getId());
    }
    
}
