package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractLampHandler;

public class LampHandler extends AbstractLampHandler {

    private final Device lamp;
    private final DeviceRepository repository;

    public LampHandler(List<String> commands, Device device, DeviceRepository deviceRepository) {
        super(commands);
        this.lamp = device;
        this.repository = deviceRepository;
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        lamp.setStatus("ON");
        repository.save(lamp);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        lamp.setStatus("OFF");
        repository.save(lamp);
    }

    @Override
    protected void changeBrightness(int brightness) {
        checkCommand("CHANGE_BRIGHTNESS");
        if (brightness < 0 || brightness > 100) {
            throw new IllegalArgumentException("Brightness must be between 0 and 100");
        }
        lamp.getFeatures().put("BRIGHTNESS", brightness);
        repository.save(lamp);
    }

    @Override
    protected void changeColor(String color) {
        checkCommand("CHANGE_COLOR");
        if (!color.matches("^#[0-9A-Fa-f]{6}$")) {
            throw new IllegalArgumentException("Color does not match hex pattern");
        }
        lamp.getFeatures().put("COLOR", color);
        repository.save(lamp);
    }

    @Override
    protected void changeColorTemperature(int colorTemperature) {
        checkCommand("CHANGE_COLOR_TEMPERATURE");
        if (colorTemperature < 0 || colorTemperature > 6) {
            throw new IllegalArgumentException("Color temperature must be between 0 and 6");
        }
        lamp.getFeatures().put("COLOR_TEMP", colorTemperature);
        repository.save(lamp);
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "TURN_ON" -> turnOn();
            case "TURN_OFF" -> turnOff();
            case "CHANGE_BRIGHTNESS" -> changeBrightness((int)arg);
            case "CHANGE_COLOR" -> changeColor((String)arg);
            case "CHANGE_COLOR_TEMPERATURE" -> changeColorTemperature((int)arg);
            default -> {
            }
        }
    }
}
