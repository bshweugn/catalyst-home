package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.LeakDetectorChargeState;

public class LeakDetectorChargeManager {

    private static final LeakDetectorChargeManager INSTANCE = new LeakDetectorChargeManager();

    private final Map<Long, LeakDetectorChargeState> ldStates = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private LeakDetectorChargeManager() {}

    public static LeakDetectorChargeManager getInstance() {
        return INSTANCE;
    }

    public void registerLeakDetector(Device ld, DeviceRepository deviceRepository) {
        ldStates.put(ld.getId(), new LeakDetectorChargeState(ld, deviceRepository));
    }

    public void deregisterLeakDetector(Long ldId) {
        ldStates.remove(ldId);
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (LeakDetectorChargeState state : ldStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }

}
