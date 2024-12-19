package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;

public class LeakDetectorChargeState {

    private final Device ld;
    private final DeviceRepository repository;
    private boolean charging;

    public LeakDetectorChargeState(Device device, DeviceRepository repository) {
        this.ld = device;
        this.repository = repository;
        this.charging = Boolean.TRUE.equals(ld.getCharging());
    }

    public synchronized void setCharging(boolean charging) {
        this.charging = charging;
        ld.setCharging(charging);
        persistState();
    }

    public synchronized void update() {
        int batteryLevel = ld.getBatteryLevel();

        if (charging) {
            batteryLevel = Math.min(batteryLevel + 2, 100);
        } else {
            batteryLevel = Math.max(batteryLevel - 1, 0);
            if (batteryLevel == 0) {
                ld.setStatus("OFF");
            }
        }
        ld.setBatteryLevel(batteryLevel);
        persistState();
    }

    private void persistState() {
        repository.save(ld);
    }
}
