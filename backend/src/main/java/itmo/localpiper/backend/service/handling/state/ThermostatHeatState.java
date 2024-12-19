package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.manager.ThermostatHeatManager;

public class ThermostatHeatState {

    private final Device thermostat;
    private final DeviceRepository repository;
    private final int targetTemperature;
    private String mode;
    private final String operation;

    public ThermostatHeatState(Device thermostat, DeviceRepository repository, int targetTemperature, String operation) {
        this.thermostat = thermostat;
        this.repository = repository;
        this.targetTemperature = targetTemperature;
        this.operation = operation;
        this.mode = thermostat.getFeatures().containsKey("MODE")? (String)thermostat.getFeatures().get("MODE") : "SOFT";
    }

    public synchronized void setMode(String mode) {
        this.mode = mode;
    }

    public synchronized void update() {
        int currentTemperature = (int)thermostat.getFeatures().get("CURRENT_TEMP");
        int adjustment = 1;
        if ("NORMAL".equals(mode)) {
            adjustment = 2;
        } else if ("MAX".equals(mode)) {
            adjustment = 3;
        }
        if ("HEATING".equals(operation)) {
            currentTemperature = Math.min(currentTemperature + adjustment, targetTemperature);
        } else if ("COOLING".equals(operation)) {
            currentTemperature = Math.max(currentTemperature - adjustment, targetTemperature);
        }

        thermostat.getFeatures().put("CURRENT_TEMP",currentTemperature);
        persistState();

        if (currentTemperature == targetTemperature) {
            ThermostatHeatManager.getInstance().deregisterThermostat(thermostat.getId());
        }
    }

    private void persistState() {
        repository.save(thermostat);
    }
}

