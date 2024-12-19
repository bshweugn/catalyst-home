package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.TemperatureSensorChargeState;

public class TemperatureSensorChargeManager {

    private static final TemperatureSensorChargeManager INSTANCE = new TemperatureSensorChargeManager();

    private final Map<Long, TemperatureSensorChargeState> tsStates = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private TemperatureSensorChargeManager() {}

    public static TemperatureSensorChargeManager getInstance() {
        return INSTANCE;
    }

    public void registerTemperatureSensor(Device ts, DeviceRepository deviceRepository) {
        tsStates.put(ts.getId(), new TemperatureSensorChargeState(ts, deviceRepository));
    }

    public void deregisterTemperatureSensor(Long relayId) {
        tsStates.remove(relayId);
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (TemperatureSensorChargeState state : tsStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}
