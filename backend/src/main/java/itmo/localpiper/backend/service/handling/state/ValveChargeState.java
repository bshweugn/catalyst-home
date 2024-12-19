package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;

public class ValveChargeState {
    private final Device valve;
    private final DeviceRepository repository;
    private boolean charging;

    public ValveChargeState(Device device, DeviceRepository repository) {
        this.valve = device;
        this.repository = repository;
        this.charging = Boolean.TRUE.equals(valve.getCharging());
    }

    public synchronized void setCharging(boolean charging) {
        this.charging = charging;
        valve.setCharging(charging);
        persistState();
    }

    public synchronized void update() {
        int batteryLevel = valve.getBatteryLevel();

        if (charging) {
            batteryLevel = Math.min(batteryLevel + 2, 100);
        } else {
            batteryLevel = Math.max(batteryLevel - 1, 0);
            if (batteryLevel == 0) {
                valve.setStatus("OFF");
            }
        }
        valve.setBatteryLevel(batteryLevel);
        persistState();
    }

    private void persistState() {
        repository.save(valve);
    }
}
