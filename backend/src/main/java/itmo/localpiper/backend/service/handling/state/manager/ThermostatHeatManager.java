package itmo.localpiper.backend.service.handling.state.manager;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.ThermostatHeatState;

public class ThermostatHeatManager {

    private static final ThermostatHeatManager INSTANCE = new ThermostatHeatManager();

    private final Map<Long, ThermostatHeatState> thermostatStates = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private ThermostatHeatManager() {}

    public static ThermostatHeatManager getInstance() {
        return INSTANCE;
    }

    public void registerHeating(Device thermostat, DeviceRepository repository, int targetTemperature) {
        deregisterThermostat(thermostat.getId());
        thermostatStates.put(thermostat.getId(), new ThermostatHeatState(thermostat, repository, targetTemperature, "HEATING"));
    }

    public void registerCooling(Device thermostat, DeviceRepository repository, int targetTemperature) {
        deregisterThermostat(thermostat.getId());
        thermostatStates.put(thermostat.getId(), new ThermostatHeatState(thermostat, repository, targetTemperature, "COOLING"));
    }

    public void deregisterThermostat(Long thermostatId) {
        thermostatStates.remove(thermostatId);
    }

    public void updateMode(Long thermostatId, String newMode) {
        ThermostatHeatState state = thermostatStates.get(thermostatId);
        if (state != null) {
            state.setMode(newMode);
        }
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (ThermostatHeatState state : thermostatStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}
