package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.manager.HumidifierManager;

public class HumidifierState {

    private final Device humidifier;
    private final DeviceRepository repository;
    private final int targetHumidity;
    private String mode;

    public HumidifierState(Device humidifier, DeviceRepository repository, int targetHumidity) {
        this.humidifier = humidifier;
        this.repository = repository;
        this.targetHumidity = targetHumidity;
        this.mode = humidifier.getFeatures().containsKey("MODE") ? 
                    (String) humidifier.getFeatures().get("MODE") : "SOFT";
    }

    public synchronized void setMode(String mode) {
        this.mode = mode;
    }

    public synchronized void update() {
        int currentHumidity = (int) humidifier.getFeatures().get("CURRENT_HUM");

        if (!HumidifierManager.getInstance().checkHumidifierState(humidifier.getId())) {
            currentHumidity = Math.max(currentHumidity - 1, 0);
        }

        int adjustment = 1;
        if ("MAX".equals(mode)) {
            adjustment = 3;
        } else if ("NORMAL".equals(mode)) {
            adjustment = 2;
        }

        if (currentHumidity < targetHumidity) {
            currentHumidity = Math.min(currentHumidity + adjustment, targetHumidity);
        }
        humidifier.getFeatures().put("CURRENT_HUM", currentHumidity);
        persistState();

        if (currentHumidity == targetHumidity) {
            HumidifierManager.getInstance().deregisterHumidifier(humidifier.getId());
        }
    }

    private void persistState() {
        Device prev = repository.findById(humidifier.getId()).get();
        if (humidifier.getFeatures().containsKey("MODE")) humidifier.getFeatures().put("MODE", prev.getFeatures().get("MODE"));
        repository.save(humidifier);
    }
}

