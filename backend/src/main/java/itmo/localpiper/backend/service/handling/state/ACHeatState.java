package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.manager.ACHeatManager;

public class ACHeatState {

    private final Device ac;
    private final DeviceRepository repository;
    private final int targetTemperature;
    private String mode;
    private final String operation;

    public ACHeatState(Device ac, DeviceRepository repository, int targetTemperature, String operation) {
        this.ac = ac;
        this.repository = repository;
        this.targetTemperature = targetTemperature;
        this.operation = operation;
        this.mode = ac.getFeatures().containsKey("MODE")? (String)ac.getFeatures().get("MODE") : "SOFT";
    }

    public synchronized void setMode(String mode) {
        this.mode = mode;
    }

    public synchronized void update() {
        int currentTemperature = (int)ac.getFeatures().get("CURRENT_TEMP");
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

        ac.getFeatures().put("CURRENT_TEMP",currentTemperature);
        persistState();

        if (currentTemperature == targetTemperature) {
            ACHeatManager.getInstance().deregisterAC(ac.getId());
        }
    }

    private void persistState() {
        Device prev = repository.findById(ac.getId()).get();
        if (ac.getFeatures().containsKey("MODE")) ac.getFeatures().put("MODE", prev.getFeatures().get("MODE"));
        if (ac.getFeatures().containsKey("WIND_MODE")) ac.getFeatures().put("WIND_MODE", prev.getFeatures().get("WIND_MODE"));
        repository.save(ac);
    }
}
