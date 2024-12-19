package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;

public class TemperatureSensorChargeState {

    private final Device ts;
    private final DeviceRepository repository;
    private boolean charging;

    public TemperatureSensorChargeState(Device device, DeviceRepository repository) {
        this.ts = device;
        this.repository = repository;
        this.charging = Boolean.TRUE.equals(ts.getCharging());
    }

    public synchronized void setCharging(boolean charging) {
        this.charging = charging;
        ts.setCharging(charging);
        persistState();
    }

    public synchronized void update() {
        int batteryLevel = ts.getBatteryLevel();

        if (charging) {
            batteryLevel = Math.min(batteryLevel + 2, 100);
        } else {
            batteryLevel = Math.max(batteryLevel - 1, 0);
            if (batteryLevel == 0) {
                ts.setStatus("OFF");
            }
        }
        ts.setBatteryLevel(batteryLevel);
        persistState();
    }

    private void persistState() {
        repository.save(ts);
    }
}
