package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractRCHandler;
import itmo.localpiper.backend.service.handling.state.manager.RCChargeManager;

public class RCHandler extends AbstractRCHandler {

    private final Device rc;
    private final DeviceRepository repository;
    private final RCChargeManager chargeManager = RCChargeManager.getInstance();

    public RCHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.rc = device;
        this.repository = deviceRepository;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "TURN_ON" -> turnOn();
            case "TURN_OFF" -> turnOff();
            case "RUN" -> run((Integer) arg);
            case "STOP" -> stop();
            case "CONTINUE" -> continueRun();
            case "FINISH" -> finish();
            case "CHARGE" -> charge();
            case "UNPLUG" -> unplug();
            case "CHANGE_SUCTION_POWER" -> changeSuctionPower((String)arg);
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        if (!"OFF".equals(rc.getStatus())) return;
        rc.setStatus("ON");
        repository.save(rc);
        RCChargeManager.getInstance().registerRC(rc, repository, "ON");
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(rc.getStatus()) && !"PAUSED".equals(rc.getStatus())) return;
        rc.setStatus("OFF");
        repository.save(rc);
        RCChargeManager.getInstance().deregister(rc.getId());
    }

    @Override
    protected void run(int duration) {
        checkCommand("RUN");
        if (!"ON".equals(rc.getStatus())) return;
        rc.setStatus("WORKING");
        RCChargeManager.getInstance().getWorkState(rc.getId()).setCleaningTime(duration);
        RCChargeManager.getInstance().getWorkState(rc.getId()).setOperation("WORKING");
        repository.save(rc);
    }

    @Override
    protected void stop() {
        checkCommand("STOP");
        if (!"WORKING".equals(rc.getStatus())) return;
        rc.setStatus("PAUSED");
        RCChargeManager.getInstance().getWorkState(rc.getId()).setOperation("PAUSED");
        repository.save(rc);
    }

    @Override
    protected void continueRun() {
        checkCommand("CONTINUE");
        if (!"PAUSED".equals(rc.getStatus())) return;
        rc.setStatus("WORKING");
        RCChargeManager.getInstance().getWorkState(rc.getId()).setOperation("WORKING");
        repository.save(rc);
    }

    @Override
    protected void finish() {
        checkCommand("FINISH");
        if (!"WORKING".equals(rc.getStatus()) && !"PAUSED".equals(rc.getStatus())) return;
        rc.setStatus("RETURNING");
        RCChargeManager.getInstance().getWorkState(rc.getId()).setCleaningTime(5);
        RCChargeManager.getInstance().getWorkState(rc.getId()).setOperation("RETURNING");
        repository.save(rc);
    }

    @Override
    protected void charge() {
        checkCommand("CHARGE");
        if ("WORKING".equals(rc.getStatus()) || "PAUSED".equals(rc.getStatus())) return;
        rc.setStatus("CHARGING");
        chargeManager.registerRC(rc, repository, "CHARGING");
        repository.save(rc);
    }

    @Override
    protected void unplug() {
        checkCommand("UNPLUG");
        if (!"CHARGING".equals(rc.getStatus())) return;
        rc.setStatus("OFF");
        chargeManager.deregister(rc.getId());
        repository.save(rc);
    }

    @Override
    protected void changeSuctionPower(String suctionPower) {
        checkCommand("CHANGE_SUCTION_POWER");
        rc.getFeatures().put("SUCTION_POWER", suctionPower);
        repository.save(rc);
    }
}
