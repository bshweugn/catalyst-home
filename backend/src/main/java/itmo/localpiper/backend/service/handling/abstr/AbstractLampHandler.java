package itmo.localpiper.backend.service.handling.abstr;

import java.util.List;

import itmo.localpiper.backend.service.handling.Handler;

public abstract class AbstractLampHandler implements Handler {

    protected List<String> supportedCommands;

    public AbstractLampHandler(List<String> supportedCommands) {
        this.supportedCommands = supportedCommands;
    }
    
    protected void checkCommand(String command) {
        if (!supportedCommands.contains(command)) {
            throw new UnsupportedOperationException("Command not supported: " + command);
        }
    }

    public abstract void pickCommand(String command, Object arg);
    protected abstract void turnOn();
    protected abstract void turnOff();
    protected abstract void changeBrightness(int brightness);
    protected abstract void changeColor(String color);
    protected abstract void changeColorTemperature(int colorTemperature);
}
