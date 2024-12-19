package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractThermostatHandler;
import itmo.localpiper.backend.service.handling.state.manager.ThermostatHeatManager;

public class ThermostatHandler extends AbstractThermostatHandler {

    private final Device thermostat;
    private final DeviceRepository repository;
    private final ThermostatHeatManager heatManager = ThermostatHeatManager.getInstance();

    public ThermostatHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.thermostat = device;
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
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        if (!"OFF".equals(thermostat.getStatus())) return;
        thermostat.setStatus("ON");
        repository.save(thermostat);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(thermostat.getStatus())) return;
        thermostat.setStatus("OFF");
        repository.save(thermostat);
        heatManager.deregisterThermostat(thermostat.getId());
    }

    @Override
    protected void heat(int target) {
        checkCommand("HEAT");
        if (!"ON".equals(thermostat.getStatus())) return;
        if ((int)thermostat.getFeatures().get("CURRENT_TEMP") >= target) return;
        heatManager.registerHeating(thermostat, repository, target);
    }

    @Override
    protected void cool(int target) {
        checkCommand("COOL");
        if (!"ON".equals(thermostat.getStatus())) return;
        if ((int)thermostat.getFeatures().get("CURRENT_TEMP") <= target) return;
        heatManager.registerCooling(thermostat, repository, target);
    }

    @Override
    protected void changeMode(String mode) {
        checkCommand("CHANGE_MODE");
        if (!"ON".equals(thermostat.getStatus())) return;
        thermostat.getFeatures().put("MODE", mode);
        repository.save(thermostat);
        heatManager.updateMode(thermostat.getId(), mode);
    }
}
