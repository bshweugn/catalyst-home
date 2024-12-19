package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractRelayHandler;
import itmo.localpiper.backend.service.handling.state.manager.RelayChargeManager;

public class RelayHandler extends AbstractRelayHandler {

    private final Device relay;
    private final DeviceRepository repository;
    private final RelayChargeManager chargeManager = RelayChargeManager.getInstance();

    public RelayHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.relay = device;
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
        if (!"OFF".equals(relay.getStatus())) return;
        relay.setStatus("ON");
        repository.save(relay);
        chargeManager.registerRelay(relay, repository);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(relay.getStatus())) return;
        relay.setStatus("OFF");
        repository.save(relay);
        chargeManager.deregisterRelay(relay.getId());
    }

    @Override
    protected void charge() {
        checkCommand("CHARGE");
        if ("ON".equals(relay.getStatus())) {
            turnOff();
        }
        if (relay.getBatteryLevel() == 100) return; 
        relay.setCharging(true);
        repository.save(relay);

        chargeManager.registerRelay(relay, repository);
    }

    @Override
    protected void unplug() {
        checkCommand("UNPLUG");
        relay.setCharging(false);
        repository.save(relay);

        chargeManager.deregisterRelay(relay.getId());
    }
    
}
