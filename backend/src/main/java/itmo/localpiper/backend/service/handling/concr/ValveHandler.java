package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractValveHandler;
import itmo.localpiper.backend.service.handling.state.manager.ValveChargeManager;

public class ValveHandler extends AbstractValveHandler {

    private final Device valve;
    private final DeviceRepository repository;
    private final ValveChargeManager chargeManager = ValveChargeManager.getInstance();

    public ValveHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.valve = device;
        this.repository = deviceRepository;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "OPEN" -> open();
            case "CLOSE" -> close();
            case "CHARGE" -> charge();
            case "UNPLUG" -> unplug();
            default -> {
            }
        }
    }

    @Override
    protected void open() {
        checkCommand("OPEN");
        if (!"CLOSED".equals(valve.getStatus())) return;
        valve.setStatus("OPENED");
        repository.save(valve);
        chargeManager.registerValve(valve, repository);
    }

    @Override
    protected void close() {
        checkCommand("CLOSE");
        if (!"OPENED".equals(valve.getStatus())) return;
        valve.setStatus("CLOSED");
        repository.save(valve);
        chargeManager.deregisterValve(valve.getId());
    }

    @Override
    protected void charge() {
        checkCommand("CHARGE");
        if ("ON".equals(valve.getStatus())) {
            close();
        }
        if (valve.getBatteryLevel() == 100) return; 
        valve.setCharging(true);
        repository.save(valve);

        chargeManager.registerValve(valve, repository);
    }

    @Override
    protected void unplug() {
        checkCommand("UNPLUG");
        valve.setCharging(false);
        repository.save(valve);

        chargeManager.deregisterValve(valve.getId());
    }
    
}
