package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractACHandler;
import itmo.localpiper.backend.service.handling.state.manager.ACHeatManager;

public class ACHandler extends AbstractACHandler {

    private final Device ac;
    private final DeviceRepository repository;
    private final ACHeatManager heatManager = ACHeatManager.getInstance();

    public ACHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.ac = device;
        this.repository = deviceRepository;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "TURN_ON" -> turnOn();
            case "TURN_OFF" -> turnOff();
            case "HEAT" -> heat((Integer) arg);
            case "COOL" -> cool((Integer) arg);
            case "CHANGE_MODE" -> changeMode((String) arg);
            case "CHANGE_WIND_MODE" -> changeWindMode((String) arg);
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        if (!"OFF".equals(ac.getStatus())) return;
        ac.setStatus("ON");
        repository.save(ac);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(ac.getStatus())) return;
        ac.setStatus("OFF");
        repository.save(ac);
        heatManager.deregisterAC(ac.getId());
    }

    @Override
    protected void heat(int target) {
        checkCommand("HEAT");
        if (!"ON".equals(ac.getStatus())) return;
        if ((int)ac.getFeatures().get("CURRENT_TEMP") >= target) return;
        heatManager.registerHeating(ac, repository, target);
    }

    @Override
    protected void cool(int target) {
        checkCommand("COOL");
        if (!"ON".equals(ac.getStatus())) return;
        if ((int)ac.getFeatures().get("CURRENT_TEMP") <= target) return;
        heatManager.registerCooling(ac, repository, target);
    }

    @Override
    protected void changeMode(String mode) {
        checkCommand("CHANGE_MODE");
        if (!"ON".equals(ac.getStatus())) return;
        ac.getFeatures().put("MODE", mode);
        repository.save(ac);
        heatManager.updateMode(ac.getId(), mode);
    }

    @Override
    protected void changeWindMode(String mode) {
        checkCommand("CHANGE_WIND_MODE");
        if (!"ON".equals(ac.getStatus())) return;
        ac.getFeatures().put("WIND_MODE", mode);
        repository.save(ac);
    }
}
