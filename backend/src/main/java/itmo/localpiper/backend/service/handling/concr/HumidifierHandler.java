package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractHumidifierHandler;
import itmo.localpiper.backend.service.handling.state.manager.HumidifierManager;

public class HumidifierHandler extends AbstractHumidifierHandler {

    private final Device humidifier;
    private final DeviceRepository repository;
    private final HumidifierManager humidifierManager = HumidifierManager.getInstance();

    public HumidifierHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.humidifier = device;
        this.repository = deviceRepository;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "TURN_ON" -> turnOn();
            case "TURN_OFF" -> turnOff();
            case "HUMIDIFY" -> humidify((Integer) arg);
            case "CHANGE_MODE" -> changeMode((String) arg);
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        if (!"OFF".equals(humidifier.getStatus())) return;
        humidifier.setStatus("ON");
        repository.save(humidifier);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(humidifier.getStatus())) return;
        humidifier.setStatus("OFF");
        repository.save(humidifier);
        humidifierManager.deregisterHumidifier(humidifier.getId());
    }

    @Override
    protected void humidify(int target) {
        checkCommand("HUMIDIFY");
        if (!"ON".equals(humidifier.getStatus())) return;
        int currentHumidity = (int) humidifier.getFeatures().get("CURRENT_HUM");
        if (currentHumidity >= target) return;
        humidifierManager.registerHumidifying(humidifier, repository, target);
    }

    @Override
    protected void changeMode(String mode) {
        checkCommand("CHANGE_MODE");
        if (!"ON".equals(humidifier.getStatus())) return;
        humidifier.getFeatures().put("MODE", mode);
        repository.save(humidifier);
        humidifierManager.updateMode(humidifier.getId(), mode);
    }
}

