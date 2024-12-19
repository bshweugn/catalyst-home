package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.ACHeatState;

public class ACHeatManager {

    private static final ACHeatManager INSTANCE = new ACHeatManager();

    private final Map<Long, ACHeatState> acStates = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private ACHeatManager() {}

    public static ACHeatManager getInstance() {
        return INSTANCE;
    }

    public void registerHeating(Device ac, DeviceRepository repository, int targetTemperature) {
        deregisterAC(ac.getId());
        acStates.put(ac.getId(), new ACHeatState(ac, repository, targetTemperature, "HEATING"));
    }

    public void registerCooling(Device ac, DeviceRepository repository, int targetTemperature) {
        deregisterAC(ac.getId());
        acStates.put(ac.getId(), new ACHeatState(ac, repository, targetTemperature, "COOLING"));
    }

    public void deregisterAC(Long thermostatId) {
        acStates.remove(thermostatId);
    }

    public void updateMode(Long acId, String newMode) {
        ACHeatState state = acStates.get(acId);
        if (state != null) {
            state.setMode(newMode);
        }
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (ACHeatState state : acStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}

