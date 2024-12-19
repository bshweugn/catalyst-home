package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;

public class RelayChargeState {

    private final Device relay;
    private final DeviceRepository repository;
    private boolean charging;

    public RelayChargeState(Device device, DeviceRepository repository) {
        this.relay = device;
        this.repository = repository;
        this.charging = Boolean.TRUE.equals(relay.getCharging());
    }

    public synchronized void setCharging(boolean charging) {
        this.charging = charging;
        relay.setCharging(charging);
        persistState();
    }

    public synchronized void update() {
        int batteryLevel = relay.getBatteryLevel();

        if (charging) {
            batteryLevel = Math.min(batteryLevel + 2, 100);
        } else {
            batteryLevel = Math.max(batteryLevel - 1, 0);
            if (batteryLevel == 0) {
                relay.setStatus("OFF");
            }
        }
        relay.setBatteryLevel(batteryLevel);
        persistState();
    }

    private void persistState() {
        repository.save(relay);
    }
}
