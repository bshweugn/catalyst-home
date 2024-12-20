package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.RCWorkState;

public class RCChargeManager {

    private static final RCChargeManager INSTANCE = new RCChargeManager();

    private final Map<Long, RCWorkState> rcStates = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private RCChargeManager() {}

    public static RCChargeManager getInstance() {
        return INSTANCE;
    }

    public void registerRC(Device rc, DeviceRepository repository, String operation) {
        deregister(rc.getId());
        rcStates.put(rc.getId(), new RCWorkState(rc, repository, operation));
    }

    public void deregister(Long rcId) {
        rcStates.remove(rcId);
    }

    public RCWorkState getWorkState(Long rcId) {
        return rcStates.get(rcId);
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (RCWorkState state : rcStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}

