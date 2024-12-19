package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractCurtainHandler;

public class CurtainHandler extends AbstractCurtainHandler {

    private final Device curtain;
    private final DeviceRepository repository;

    public CurtainHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.curtain = device;
        this.repository = deviceRepository;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "OPEN" -> open();
            case "CLOSE" -> close();
            case "CHANGE_PERCENTAGE" -> changePercentage((int)arg);
            default -> {
            }
        }
    }

    @Override
    protected void open() {
        checkCommand("OPEN");
        curtain.setStatus("OPENED");
        curtain.getFeatures().put("PERCENTAGE", !curtain.getFeatures().containsKey("BUFFER")? 100 : curtain.getFeatures().get("BUFFER"));
        repository.save(curtain);
    }

    @Override
    protected void close() {
        checkCommand("CLOSE");
        if (curtain.getFeatures().containsKey("BUFFER")) curtain.getFeatures().put("BUFFER", curtain.getFeatures().get("PERCENTAGE"));
        curtain.getFeatures().put("PERCENTAGE", 0);
        curtain.setStatus("CLOSED");
        repository.save(curtain);
    }

    @Override
    protected void changePercentage(int percentage) {
        checkCommand("CHANGE_PERCENTAGE");
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Percentage must be between 0 and 100");
        }
        curtain.getFeatures().put("PERCENTAGE", percentage);
        if (curtain.getFeatures().containsKey("BUFFER")) curtain.getFeatures().put("BUFFER", percentage);
        if (percentage > 0) {
            curtain.setStatus("OPENED");
        } else {
            curtain.setStatus("CLOSED");
        }
        repository.save(curtain);
        
    }
    
}
