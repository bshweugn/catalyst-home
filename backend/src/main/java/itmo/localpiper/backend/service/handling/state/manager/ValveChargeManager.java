package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.ValveChargeState;

public class ValveChargeManager {

    private static final ValveChargeManager INSTANCE = new ValveChargeManager();

    private final Map<Long, ValveChargeState> valveStates = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private ValveChargeManager() {}

    public static ValveChargeManager getInstance() {
        return INSTANCE;
    }

    public void registerValve(Device valve, DeviceRepository deviceRepository) {
        valveStates.put(valve.getId(), new ValveChargeState(valve, deviceRepository));
    }

    public void deregisterValve(Long relayId) {
        valveStates.remove(relayId);
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (ValveChargeState state : valveStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}
