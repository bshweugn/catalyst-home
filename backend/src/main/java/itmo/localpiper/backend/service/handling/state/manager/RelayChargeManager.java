package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.RelayChargeState;

public class RelayChargeManager {

    private static final RelayChargeManager INSTANCE = new RelayChargeManager();

    private final Map<Long, RelayChargeState> relayStates = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private RelayChargeManager() {}

    public static RelayChargeManager getInstance() {
        return INSTANCE;
    }

    public void registerRelay(Device relay, DeviceRepository deviceRepository) {
        relayStates.put(relay.getId(), new RelayChargeState(relay, deviceRepository));
    }

    public void deregisterRelay(Long relayId) {
        relayStates.remove(relayId);
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (RelayChargeState state : relayStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}
