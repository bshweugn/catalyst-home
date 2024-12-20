package itmo.localpiper.backend.service.handling.state;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.state.manager.RCChargeManager;

public class RCWorkState {

    private final Device rc;
    private final DeviceRepository repository;
    private String operation;
    private int cleaningTimeRemaining;

    public RCWorkState(Device rc, DeviceRepository repository, String operation) {
        this.rc = rc;
        this.repository = repository;
        this.operation = operation;
        this.cleaningTimeRemaining = 0;
    }

    public synchronized void setOperation(String operation) {
        this.operation = operation;
    }

    public synchronized void setCleaningTime(int time) {
        this.cleaningTimeRemaining = time;
    }

    public synchronized void update() {
        int batteryLevel = rc.getBatteryLevel();

        switch (operation) {
            case "CHARGING" -> {
                batteryLevel = Math.min(batteryLevel + 5, 100);
                if (batteryLevel == 100) {
                    rc.setStatus("OFF");
                    repository.save(rc);
                    RCChargeManager.getInstance().deregister(rc.getId());
                }
            }
            case "WORKING" -> {
                batteryLevel = Math.max(batteryLevel - 3, 0);
                cleaningTimeRemaining -= 3;
                if (cleaningTimeRemaining <= 0 || batteryLevel < 10) {
                    rc.setStatus("RETURNING");
                    repository.save(rc);
                    operation = "RETURNING";
                    cleaningTimeRemaining = 5;
                }
            }
            case "RETURNING" -> {
                cleaningTimeRemaining -= 3;
                if (cleaningTimeRemaining <= 0) {
                    rc.setStatus("OFF");
                    repository.save(rc);
                    if (batteryLevel < 10) {
                        RCChargeManager.getInstance().registerRC(rc, repository, "CHARGING");
                    } else {
                        RCChargeManager.getInstance().deregister(rc.getId());
                    }
                }
            }
            case "PAUSED" -> batteryLevel = Math.max(batteryLevel - 1, 0);
            case "ON" -> batteryLevel = Math.max(batteryLevel - 1, 0);
        }
        System.out.println(operation + " " + cleaningTimeRemaining);
        rc.setBatteryLevel(batteryLevel);
        persistState();
    }

    private void persistState() {
        Device prev = repository.findById(rc.getId()).get();
        rc.setStatus(prev.getStatus());
        if (rc.getFeatures().containsKey("SUCTION_POWER")) rc.getFeatures().put("SUCTION_POWER", prev.getFeatures().get("SUCTION_POWER"));
        repository.save(rc);
    }
}

