package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.HumidifierState;

public class HumidifierManager {

    private static final HumidifierManager INSTANCE = new HumidifierManager();

    private final Map<Long, HumidifierState> humidifierStates = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private HumidifierManager() {}

    public static HumidifierManager getInstance() {
        return INSTANCE;
    }

    public void registerHumidifying(Device humidifier, DeviceRepository repository, int targetHumidity) {
        deregisterHumidifier(humidifier.getId());
        humidifierStates.put(humidifier.getId(), new HumidifierState(humidifier, repository, targetHumidity));
    }

    public void deregisterHumidifier(Long humidifierId) {
        humidifierStates.remove(humidifierId);
    }

    public boolean checkHumidifierState(Long id) {
        return humidifierStates.containsKey(id);
    }

    public void updateMode(Long humidifierId, String newMode) {
        HumidifierState state = humidifierStates.get(humidifierId);
        if (state != null) {
            state.setMode(newMode);
        }
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (HumidifierState state : humidifierStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}
